import { Play, Building2, FileText, LogIn, CheckCircle, Folder, GraduationCap, Clock, Building, Briefcase, Award, CheckCircle2 } from 'lucide-react';

export const procedures = {
  company: [
    { title: "Mulai", description: "Prosedur magang dimulai.", icon: Play },
    { title: 'Klik "Daftar sebagai Perusahaan"', description: "Mulai proses pendaftaran dengan memilih opsi 'Daftar sebagai Perusahaan' di website manajemen.hummatech.com", icon: Building2 },
    { title: "Isi Formulir Registrasi", description: "Lengkapi data perusahaan dan unggah dokumen yang diperlukan.", icon: FileText },
    { title: "Login ke Akun", description: "Setelah pendaftaran berhasil, login menggunakan email dan password yang telah didaftarkan.", icon: LogIn },
    { title: "Selesai", description: "Akun perusahaan aktif dan siap digunakan untuk mengelola absensi serta magang.", icon: CheckCircle },
  ],
  student: [
    { title: "Mulai", description: "Prosedur magang dimulai.", icon: Play },
    { title: "Siapkan Berkas", description: "Siap dan lengkapi berkas persyaratan seperti CV, surat pengantar dan lain-lain.", icon: Folder },
    { title: 'Klik "Daftar sebagai Siswa Magang"', description: "Mulai proses pendaftaran dengan memilih opsi 'Daftar sebagai Siswa Magang'.", icon: GraduationCap },
    { title: "Menunggu Persetujuan", description: "Setelah data lengkap dan benar menunggu persetujuan admin untuk proses selanjutnya.", icon: Clock },
    { title: "Penetapan Divisi", description: "Setelah diterima di perusahaan, siswa akan ditempatkan di divisi sesuai bidang keahlian.", icon: Building },
    { title: "Magang Dimulai", description: "Siswa sudah bisa memulai magang sesuai jadwal.", icon: Briefcase },
    { title: "Sertifikat Magang", description: "Setelah menyelesaikan masa magang, siswa akan mendapatkan sertifikat.", icon: Award },
    { title: "Selesai", description: "Proses magang selesai dan siswa dapat mengakses sertifikat di dashboard.", icon: CheckCircle2 },
  ],
};
