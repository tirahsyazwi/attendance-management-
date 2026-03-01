import React from 'react';
import { WarningTrigger } from '../types';

interface WarningLetterTemplateProps {
  student: WarningTrigger;
}

export const WarningLetterTemplate: React.FC<WarningLetterTemplateProps> = ({ student }) => {
  const currentDate = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
  
  return (
    <div className="print-only p-12 bg-white text-black font-serif leading-relaxed h-screen">
      <div className="text-center mb-8 border-b-2 border-black pb-4">
        <h1 className="text-xl font-bold uppercase">Sekolah Menengah Kebangsaan (SMK) Contoh</h1>
        <p className="text-sm">Jalan Pendidikan, 50000 Kuala Lumpur</p>
        <p className="text-sm">Tel: 03-12345678 | Faks: 03-12345679</p>
      </div>

      <div className="flex justify-between mb-8">
        <div>
          <p>Ruj. Kami: SMK/HEM/AMR/{student.id}</p>
          <p>Tarikh: {currentDate}</p>
        </div>
      </div>

      <div className="mb-8">
        <p className="font-bold">{student.studentName}</p>
        <p>Kelas: {student.studentClass}</p>
        <p className="mt-4">Tuan/Puan,</p>
      </div>

      <div className="mb-8">
        <h2 className="font-bold underline uppercase mb-4">
          {student.type}: TIDAK HADIR KE SEKOLAH TANPA SEBAB
        </h2>
        <p className="mb-4">
          Dengan hormatnya saya merujuk kepada perkara di atas.
        </p>
        <p className="mb-4">
          2. Dimaklumkan bahawa anak/tanggungan tuan/puan yang bernama di atas didapati tidak hadir ke sekolah
          sebanyak <span className="font-bold">{student.totalAbsentUnexcused} hari</span> tanpa sebab yang munasabah.
        </p>
        <p className="mb-4">
          3. Pihak sekolah amat memandang serius perkara ini kerana ia boleh menjejaskan prestasi akademik
          dan sahsiah murid tersebut. Tuan/puan diminta hadir ke sekolah untuk berbincang dengan pihak sekolah
          mengenai perkara ini.
        </p>
        <p className="mb-4">
          4. Sekiranya tuan/puan tidak menghubungi pihak sekolah dalam tempoh 3 hari dari tarikh surat ini,
          tindakan selanjutnya akan diambil mengikut peraturan disiplin sekolah yang sedia ada.
        </p>
      </div>

      <div className="mt-12">
        <p>Sekian, terima kasih.</p>
        <p className="font-bold mt-4">"BERKHIDMAT UNTUK NEGARA"</p>
        <p className="mt-12">..........................................</p>
        <p className="font-bold">(PENGETUA/PENOLONG KANAN HEM)</p>
        <p>SMK Contoh</p>
      </div>
    </div>
  );
};
