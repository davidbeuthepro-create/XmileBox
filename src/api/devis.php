<?php
/**
 * Formulaire de devis Team building : POST -> email via SMTP authentifié (PHPMailer), réponse JSON.
 *
 * Rien n'est stocké sur le serveur : la demande part uniquement par email.
 * Les identifiants SMTP vivent dans xmile-config.php, UN DOSSIER AU-DESSUS de public_html (jamais dans le dépôt).
 * Contenu attendu de xmile-config.php :
 *   <?php return [
 *     'smtp_host' => 'smtp.hostinger.com', 'smtp_port' => 465,
 *     'smtp_user' => 'site@crossfitxmile.com', 'smtp_pass' => '...',
 *     'from' => 'site@crossfitxmile.com', 'to' => 'xmileconcept@gmail.com',
 *   ];
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function reponse(int $code, array $data): void
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    reponse(405, ['ok' => false, 'error' => 'Méthode non autorisée.']);
}

// ---------- Anti-spam : champ piège, délai minimal, limite par IP ----------
if (trim((string)($_POST['website'] ?? '')) !== '') {
    reponse(200, ['ok' => true]); // un robot croit avoir réussi, rien n'est envoyé
}
$t = (int)($_POST['t'] ?? 0); // heure d'ouverture de la page, en millisecondes (posée par le JavaScript du formulaire)
if ($t <= 0 || (time() - intdiv($t, 1000)) < 4) {
    reponse(429, ['ok' => false, 'error' => 'Envoi trop rapide : réessaie dans quelques secondes.']);
}
$ip = $_SERVER['REMOTE_ADDR'] ?? 'inconnue';
$fichier = sys_get_temp_dir() . '/xmile-devis-' . md5($ip) . '.json';
$limite = 5;           // envois max
$fenetre = 3600;       // par heure
$historique = [];
if (is_file($fichier)) {
    $lu = json_decode((string)file_get_contents($fichier), true);
    $historique = is_array($lu) ? array_values(array_filter($lu, fn($x) => is_int($x) && $x > time() - $fenetre)) : [];
}
if (count($historique) >= $limite) {
    reponse(429, ['ok' => false, 'error' => 'Trop de demandes depuis cette connexion. Réessaie plus tard ou appelle-nous.']);
}

// ---------- Validation côté serveur ----------
$nettoyer = static function (string $k, int $max = 200): string {
    $v = trim((string)($_POST[$k] ?? ''));
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', '', $v) ?? '';
    return mb_substr($v, 0, $max);
};
$entreprise = $nettoyer('company', 150);
$nom = $nettoyer('name', 150);
$fonction = $nettoyer('role', 150);
$email = $nettoyer('email', 200);
$tel = $nettoyer('phone', 50);
$taille = $nettoyer('size', 10);
$quand = $nettoyer('when', 200);
$format = $nettoyer('format', 150);
$message = $nettoyer('msg', 4000);

$erreurs = [];
if ($entreprise === '') $erreurs['company'] = 'Champ requis';
if ($nom === '') $erreurs['name'] = 'Champ requis';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $erreurs['email'] = $email === '' ? 'Champ requis' : 'Adresse email invalide';
if (!ctype_digit($taille) || (int)$taille < 1 || (int)$taille > 1000) $erreurs['size'] = 'Indique un nombre de participants';
if ($erreurs) {
    reponse(422, ['ok' => false, 'errors' => $erreurs]);
}

// ---------- Configuration SMTP (hors dépôt) ----------
$configPath = dirname($_SERVER['DOCUMENT_ROOT'] ?? __DIR__) . '/xmile-config.php';
$config = is_file($configPath) ? include $configPath : null;
if (!is_array($config) || empty($config['smtp_user']) || empty($config['smtp_pass'])) {
    error_log('devis.php : xmile-config.php absent ou incomplet (' . $configPath . ')');
    reponse(503, ['ok' => false, 'error' => 'L\'envoi du formulaire n\'est pas disponible pour le moment. Écris-nous directement par email ou appelle-nous.']);
}

require __DIR__ . '/phpmailer/Exception.php';
require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';

$lignes = [
    'Entreprise : ' . $entreprise,
    'Contact : ' . $nom . ($fonction !== '' ? ' (' . $fonction . ')' : ''),
    'Email : ' . $email,
    'Téléphone : ' . ($tel !== '' ? $tel : 'non renseigné'),
    'Participants : ' . $taille,
    'Période ou date souhaitée : ' . ($quand !== '' ? $quand : 'non renseignée'),
    'Format envisagé : ' . ($format !== '' ? $format : 'non précisé'),
    '',
    'Message :',
    $message !== '' ? $message : '(aucun)',
];

try {
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'] ?? 'smtp.hostinger.com';
    $mail->Port = (int)($config['smtp_port'] ?? 465);
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
    $mail->Username = $config['smtp_user'];
    $mail->Password = $config['smtp_pass'];
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($config['from'] ?? $config['smtp_user'], 'Site Xmile CrossFit');
    $mail->addAddress($config['to'] ?? 'xmileconcept@gmail.com');
    $mail->addReplyTo($email, $nom); // répondre directement au demandeur depuis Gmail
    $mail->Subject = '[Team building] ' . $entreprise . ' · ' . $taille . ' participants';
    $mail->Body = implode("\n", $lignes);
    $mail->isHTML(false);
    $mail->send();
} catch (Throwable $e) {
    error_log('devis.php : envoi impossible : ' . $e->getMessage());
    reponse(502, ['ok' => false, 'error' => 'L\'envoi a échoué. Réessaie dans un instant ou écris-nous directement par email.']);
}

$historique[] = time();
@file_put_contents($fichier, json_encode($historique), LOCK_EX);
reponse(200, ['ok' => true]);
