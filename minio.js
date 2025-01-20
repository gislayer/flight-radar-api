const { exec } = require('child_process');
const path = require('path');

// MinIO'nun kurulu olduğu dizini belirt
const minioPath = '/opt/homebrew/bin'; // Homebrew ile yüklenen MinIO'nun yolu
process.chdir(minioPath);

// MinIO server komutunu çalıştır
const minioCommand = './minio server /Users/alikilic/GISLayer/minio-data';

exec(minioCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Komut çalıştırılırken hata oluştu: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`Komut sırasında hata: ${stderr}`);
    return;
  }

  console.log(`Komut çıktısı: ${stdout}`);
});