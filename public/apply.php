<?php
header('Content-Type: application/json; charset=utf-8');

function fail($message, $status = 400) {
  http_response_code($status);
  echo json_encode(['message' => $message]);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed.', 405);

$name = trim($_POST['name'] ?? '');
$age = trim($_POST['age'] ?? '');
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone = trim($_POST['phone'] ?? '');
$category = trim($_POST['category'] ?? '');
$jobTitle = trim($_POST['job_title'] ?? '');
$cv = $_FILES['cv'] ?? null;

if (!$name || !$age || !$email || !$category || !$jobTitle || !$cv) fail('Please complete all required fields and attach your CV.');
if (!ctype_digit($age) || (int)$age < 18 || (int)$age > 99) fail('Please enter a valid age.');
if ($cv['error'] !== UPLOAD_ERR_OK) fail('There was a problem uploading your CV.');
if ($cv['size'] > 5 * 1024 * 1024) fail('Your CV must be 5 MB or smaller.');

$allowed = [
  'application/pdf' => 'pdf',
  'application/msword' => 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
];
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($cv['tmp_name']);
if (!isset($allowed[$mime])) fail('Please upload a PDF, DOC or DOCX CV.');

$boundary = 'EI-' . md5((string) microtime(true));
$safeName = preg_replace('/[^A-Za-z0-9._-]/', '_', basename($cv['name']));
$text = "New website application\r\n\r\nJob vacancy: $jobTitle\r\nName: $name\r\nAge: $age\r\nEmail: $email\r\nPhone: " . ($phone ?: 'Not provided') . "\r\nCategory: $category\r\n";
$body = "--$boundary\r\n";
$body .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n$text\r\n";
$body .= "--$boundary\r\n";
$body .= "Content-Type: $mime; name=\"$safeName\"\r\n";
$body .= "Content-Disposition: attachment; filename=\"$safeName\"\r\n";
$body .= "Content-Transfer-Encoding: base64\r\n\r\n";
$body .= chunk_split(base64_encode(file_get_contents($cv['tmp_name'])));
$body .= "--$boundary--";

$headers = [
  'From: Emerald Isle Website <no-reply@emeraldisle.lk>',
  "Reply-To: $email",
  'MIME-Version: 1.0',
  "Content-Type: multipart/mixed; boundary=\"$boundary\"",
];

if (!mail('cv@emeraldisle.lk', "Application: $jobTitle - $name", $body, implode("\r\n", $headers))) {
  fail('We could not send your application. Please try again or email cv@emeraldisle.lk.', 500);
}

echo json_encode(['message' => 'Application sent successfully.']);