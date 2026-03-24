import React, { forwardRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { type Agreement } from "@workspace/api-client-react";
import { formatIndonesianDate, formatRupiah } from "@/lib/utils";

interface DocumentTemplateProps {
  agreement: Agreement;
  isSigning?: boolean;
  signatureCanvasRef?: React.RefObject<SignatureCanvas | null>;
  onClearSignature?: () => void;
}

export const DocumentTemplate = forwardRef<HTMLDivElement, DocumentTemplateProps>(
  ({ agreement, isSigning, signatureCanvasRef, onClearSignature }, ref) => {
    return (
      <div 
        ref={ref} 
        className="a4-document font-serif text-[15px] leading-relaxed text-black break-words"
        id="pdf-content"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/api/assets/logo" 
            alt="Logo SBP" 
            className="w-24 h-24 object-contain mb-4"
          />
          <h1 className="text-xl font-bold text-center underline uppercase tracking-wide">
            Surat Perjanjian Pemasaran Properti
          </h1>
          <p className="text-sm mt-1">Nomor: {agreement.nomor}</p>
        </div>

        {/* Intro */}
        <div className="mb-6 text-justify">
          <p className="mb-4">
            Pada hari ini, tanggal <strong>{formatIndonesianDate(agreement.tanggal_perjanjian)}</strong>, bertempat di Sleman, kami yang bertanda tangan di bawah ini:
          </p>

          <div className="pl-4 mb-4">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="w-8 font-bold align-top">I.</td>
                  <td className="w-32 align-top">Nama</td>
                  <td className="w-4 align-top">:</td>
                  <td className="align-top font-bold">CV Salam Bumi Property</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="align-top">Alamat</td>
                  <td className="align-top">:</td>
                  <td className="align-top">Jl Pajajaran, Catur Tunggal, Depok, Sleman (Virtual Office)</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="align-top">No. Telp</td>
                  <td className="align-top">:</td>
                  <td className="align-top">0813-9127-8889</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="align-top">Email</td>
                  <td className="align-top">:</td>
                  <td className="align-top">salambumiproperty@gmail.com</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="align-top">Website</td>
                  <td className="align-top">:</td>
                  <td className="align-top">salambumi.xyz</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-justify">
              Dalam hal ini bertindak sebagai penyedia jasa pemasaran properti, yang selanjutnya disebut sebagai <strong>PIHAK PERTAMA</strong>.
            </p>
          </div>

          <div className="pl-4 mb-4">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="w-8 font-bold align-top">II.</td>
                  <td className="w-32 align-top">Nama</td>
                  <td className="w-4 align-top">:</td>
                  <td className="align-top font-bold uppercase">{agreement.nama_owner}</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="align-top">NIK</td>
                  <td className="align-top">:</td>
                  <td className="align-top">{agreement.nik}</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="align-top">Alamat</td>
                  <td className="align-top">:</td>
                  <td className="align-top">{agreement.alamat_owner}</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-justify">
              Dalam hal ini bertindak selaku pemilik atau pihak yang berhak atas properti, yang selanjutnya disebut sebagai <strong>PIHAK KEDUA</strong>.
            </p>
          </div>

          <p className="mt-4 text-justify">
            PIHAK PERTAMA dan PIHAK KEDUA secara bersama-sama disebut <strong>PARA PIHAK</strong>, sepakat untuk mengikatkan diri dalam Perjanjian Pemasaran Properti dengan syarat dan ketentuan sebagai berikut:
          </p>
        </div>

        {/* Pasals */}
        <div className="space-y-4 text-justify">
          <div>
            <h2 className="text-center font-bold mb-2">PASAL 1<br/>OBJEK PERJANJIAN</h2>
            <p>
              PIHAK KEDUA menunjuk PIHAK PERTAMA sebagai agen pemasaran untuk mencarikan pembeli atas properti milik PIHAK KEDUA dengan rincian sebagai berikut:
            </p>
            <table className="w-full mt-2 pl-4">
              <tbody>
                <tr>
                  <td className="w-48 align-top pl-4">- Jenis Properti</td>
                  <td className="w-4 align-top">:</td>
                  <td className="align-top">{agreement.jenis_properti}</td>
                </tr>
                <tr>
                  <td className="align-top pl-4">- Luas Tanah / Bangunan</td>
                  <td className="align-top">:</td>
                  <td className="align-top">{agreement.luas_tanah}</td>
                </tr>
                <tr>
                  <td className="align-top pl-4">- Legalitas</td>
                  <td className="align-top">:</td>
                  <td className="align-top">{agreement.legalitas}</td>
                </tr>
                <tr>
                  <td className="align-top pl-4">- Alamat Properti</td>
                  <td className="align-top">:</td>
                  <td className="align-top">{agreement.alamat_properti}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h2 className="text-center font-bold mb-2 mt-6">PASAL 2<br/>PENUNJUKAN</h2>
            <p>
              PIHAK PERTAMA menerima penunjukan dari PIHAK KEDUA untuk memasarkan objek properti sesuai dengan spesifikasi pada Pasal 1, melalui berbagai media promosi yang dimiliki oleh PIHAK PERTAMA tanpa memungut biaya promosi di muka.
            </p>
          </div>

          <div>
            <h2 className="text-center font-bold mb-2 mt-6">PASAL 3<br/>HARGA NETT</h2>
            <p>
              PARA PIHAK sepakat bahwa harga jual NETT yang diterima oleh PIHAK KEDUA atas properti tersebut adalah sebesar <strong>{formatRupiah(agreement.harga_nett)}</strong>. Segala kelebihan harga jual di atas harga NETT tersebut sepenuhnya menjadi hak margin PIHAK PERTAMA.
            </p>
          </div>

          <div>
            <h2 className="text-center font-bold mb-2 mt-6">PASAL 4<br/>HAK MARGIN</h2>
            <p>
              Apabila PIHAK PERTAMA berhasil menjual properti tersebut dengan harga di atas Harga NETT yang disepakati, maka selisih harga tersebut mutlak merupakan hak (margin) dari PIHAK PERTAMA. Pembayaran margin ini wajib diserahkan oleh PIHAK KEDUA kepada PIHAK PERTAMA pada saat transaksi pembayaran dari pembeli telah diterima lunas atau sesuai termin yang disepakati dengan pembeli.
            </p>
          </div>

          <div>
            <h2 className="text-center font-bold mb-2 mt-6">PASAL 5<br/>AHLI WARIS & DISTRIBUSI MARGIN</h2>
            <p>
              PIHAK PERTAMA sepakat untuk mengalokasikan sebagian dari hak margin sebagaimana dimaksud pada Pasal 4, yakni sebesar <strong>Rp 10.000.000 (Sepuluh Juta Rupiah)</strong>, kepada <strong>IR. DJONI HERDIWAN, MM</strong> (NIK: 3173052309680009). Alokasi ini diambil dari margin PIHAK PERTAMA dan <strong>TIDAK MENGURANGI</strong> jumlah Harga NETT yang menjadi hak PIHAK KEDUA. Pembayaran ini diserahkan setelah proses penandatanganan Akta Jual Beli (AJB) selesai.
            </p>
          </div>

          <div>
            <h2 className="text-center font-bold mb-2 mt-6">PASAL 6<br/>LARANGAN INTERVENSI</h2>
            <p>
              PIHAK KEDUA dilarang melakukan intervensi, negosiasi harga secara langsung, atau memberitahukan Harga NETT kepada calon pembeli yang dibawa oleh PIHAK PERTAMA. Segala bentuk negosiasi harga dengan pembeli wajib dilakukan melalui atau atas sepengetahuan PIHAK PERTAMA.
            </p>
          </div>

          <div>
            <h2 className="text-center font-bold mb-2 mt-6">PASAL 7<br/>ANTI BYPASS</h2>
            <p>
              Apabila PIHAK KEDUA diketahui melakukan transaksi jual beli secara langsung ("bypass") dengan calon pembeli yang sebelumnya telah diperkenalkan atau dibawa oleh PIHAK PERTAMA, maka PIHAK KEDUA tetap berkewajiban membayarkan komisi / margin pemasaran kepada PIHAK PERTAMA sesuai dengan kesepakatan awal atau standar persentase komisi umum (minimal 3% dari nilai transaksi sesungguhnya).
            </p>
          </div>

          <div>
            <h2 className="text-center font-bold mb-2 mt-6">PASAL 8<br/>KEWAJIBAN PARA PIHAK</h2>
            <p>
              PIHAK PERTAMA wajib melaksanakan pemasaran dengan iktikad baik. PIHAK KEDUA wajib memberikan informasi yang akurat mengenai properti, serta menjamin bahwa properti tersebut tidak dalam status sengketa hukum atau agunan yang bermasalah.
            </p>
          </div>

          <div>
            <h2 className="text-center font-bold mb-2 mt-6">PASAL 9<br/>PAJAK DAN BIAYA LAINNYA</h2>
            <p>
              Pajak Penghasilan (PPh) penjual, Pajak Bumi dan Bangunan (PBB) tertunggak, serta biaya notaris yang menjadi porsi penjual (bila ada) sepenuhnya menjadi tanggung jawab PIHAK KEDUA dan dipotong dari Harga NETT, kecuali disepakati lain antara PIHAK KEDUA dan Pembeli.
            </p>
          </div>
        </div>

        {/* Signatures Section */}
        <div className="mt-16 pb-12">
          <p className="text-justify mb-8">
            Demikian perjanjian ini dibuat dengan sebenarnya dalam keadaan sadar dan tanpa paksaan dari pihak manapun, untuk dapat dipergunakan sebagaimana mestinya.
          </p>

          <div className="flex justify-between px-10">
            {/* PIHAK PERTAMA */}
            <div className="text-center relative">
              <p className="mb-4"><strong>PIHAK PERTAMA</strong></p>
              <div className="h-32 flex items-center justify-center relative w-48">
                <img 
                  src="/api/assets/signature-agent" 
                  alt="Tanda Tangan Pihak Pertama" 
                  className="max-h-28 object-contain absolute z-10"
                />
              </div>
              <p className="font-bold underline mt-4">CV SALAM BUMI PROPERTY</p>
            </div>

            {/* PIHAK KEDUA */}
            <div className="text-center relative">
              <p className="mb-4"><strong>PIHAK KEDUA</strong></p>
              
              <div className="h-32 w-56 flex items-center justify-center relative border border-transparent rounded bg-transparent">
                {/* Materai Background */}
                <div className="absolute left-0 bottom-0 opacity-80 z-0">
                  <img 
                    src="/api/assets/materai" 
                    alt="Materai 10000" 
                    className="w-20 object-contain"
                  />
                </div>

                {isSigning ? (
                  <>
                    <div className="absolute inset-0 z-10 w-full h-full border-2 border-dashed border-primary/30 rounded-md overflow-hidden bg-white/50 backdrop-blur-[2px]">
                      <SignatureCanvas
                        ref={signatureCanvasRef}
                        penColor="blue"
                        canvasProps={{ className: "w-full h-full" }}
                      />
                    </div>
                    {onClearSignature && (
                      <button 
                        onClick={onClearSignature}
                        className="absolute -right-4 -top-4 bg-muted text-muted-foreground hover:bg-destructive hover:text-destructive-foreground rounded-full p-1 shadow-md z-20 no-print transition-colors"
                        type="button"
                        title="Hapus Tanda Tangan"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    )}
                  </>
                ) : (
                  agreement.signature_url ? (
                    <img 
                      src={agreement.signature_url} 
                      alt="Tanda Tangan Pihak Kedua" 
                      className="absolute inset-0 w-full h-full object-contain z-10"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <span className="text-muted-foreground/50 italic text-sm">(Belum Ditandatangani)</span>
                    </div>
                  )
                )}
              </div>
              <p className="font-bold underline mt-4 uppercase">{agreement.nama_owner}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

DocumentTemplate.displayName = "DocumentTemplate";
