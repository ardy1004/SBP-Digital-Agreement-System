import { useRef, useState, useEffect, useCallback } from "react";
import { useRoute } from "wouter";
import { useGetAgreement, useSignAgreement } from "@workspace/api-client-react";
import SignatureCanvas from "react-signature-canvas";
import { DocumentTemplate } from "@/components/DocumentTemplate";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle, PenTool, Check, Trash2 } from "lucide-react";
import { useLocation } from "wouter";

export default function SigningPage() {
  const [, params] = useRoute("/agreement/:id");
  const id = params?.id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: agreement, isLoading, isError } = useGetAgreement(id || "");
  const signMutation = useSignAgreement();

  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 200 });
  const [hasSigned, setHasSigned] = useState(false);

  // If already signed, redirect to success
  useEffect(() => {
    if (agreement?.status === "signed") {
      setLocation(`/agreement/${id}/success`);
    }
  }, [agreement, id, setLocation]);

  // Measure the canvas wrapper and set exact pixel dimensions
  useEffect(() => {
    const measure = () => {
      if (canvasWrapperRef.current) {
        const { width, height } = canvasWrapperRef.current.getBoundingClientRect();
        if (width > 0 && height > 0) {
          setCanvasSize({ width: Math.floor(width), height: Math.floor(height) });
        }
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const handleClearSignature = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
      setHasSigned(false);
    }
  };

  const handleEndStroke = useCallback(() => {
    setHasSigned(true);
  }, []);

  const handleSign = async () => {
    if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
      toast({
        title: "Tanda Tangan Kosong",
        description: "Silakan bubuhkan tanda tangan Anda pada kolom tanda tangan di atas.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const signatureData = sigCanvasRef.current.getCanvas().toDataURL("image/png");

      await signMutation.mutateAsync({
        id: id as string,
        data: { signature_data: signatureData },
      });

      toast({
        title: "Berhasil",
        description: "Perjanjian berhasil disimpan!",
      });

      setLocation(`/agreement/${id}/success`);
    } catch (error: any) {
      toast({
        title: "Gagal Menyimpan",
        description: error.message || "Terjadi kesalahan sistem",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Memuat Dokumen Perjanjian...</p>
      </div>
    );
  }

  if (isError || !agreement) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Dokumen Tidak Ditemukan</h2>
          <p className="text-muted-foreground mb-6">Link perjanjian mungkin salah atau sudah kedaluwarsa.</p>
        </div>
      </div>
    );
  }

  if (agreement.status === "signed") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-8 flex flex-col items-center">
      <div className="w-full max-w-[794px] mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Tanda Tangan Digital</h1>
        <p className="text-slate-500 text-sm mt-1">Baca seluruh isi perjanjian lalu bubuhkan tanda tangan Anda.</p>
      </div>

      {/* A4 Document Preview */}
      <div className="w-full overflow-x-auto pb-4 flex justify-center">
        <div className="shadow-2xl shadow-black/10">
          <DocumentTemplate
            agreement={agreement}
            isSigning={false}
          />
        </div>
      </div>

      {/* Dedicated Signature Section */}
      <div className="w-full max-w-[794px] mt-8 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-full text-amber-600">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Tanda Tangan PIHAK KEDUA</p>
              <p className="text-sm text-slate-500">Gambar tanda tangan Anda pada area di bawah ini</p>
            </div>
          </div>
          <button
            onClick={handleClearSignature}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-500 hover:text-destructive hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Hapus
          </button>
        </div>

        {/* Signature canvas with materai overlay */}
        <div
          ref={canvasWrapperRef}
          className="relative w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 overflow-hidden"
          style={{ height: "200px" }}
        >
          {/* Materai stamp bottom-left */}
          <img
            src="/api/assets/materai"
            alt="Materai 10000"
            style={{
              position: "absolute",
              left: "12px",
              bottom: "8px",
              width: "110px",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />

          {/* Signature canvas on top — transparent so materai shows through */}
          <SignatureCanvas
            ref={sigCanvasRef}
            penColor="black"
            minWidth={1.5}
            maxWidth={3}
            onEnd={handleEndStroke}
            canvasProps={{
              width: canvasSize.width,
              height: canvasSize.height,
              style: {
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                background: "transparent",
                cursor: "crosshair",
                zIndex: 2,
              },
            }}
          />

          {/* Placeholder hint when empty */}
          {!hasSigned && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 0,
                pointerEvents: "none",
              }}
            >
              <p className="text-slate-300 text-sm italic select-none">Tanda tangan di sini...</p>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 mt-2">
          Dengan menandatangani dokumen ini, Anda menyetujui seluruh isi perjanjian di atas.
        </p>

        {/* Save Button */}
        <button
          onClick={handleSign}
          disabled={isSubmitting}
          className="w-full mt-4 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:transform-none"
        >
          {isSubmitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</>
          ) : (
            <><Check className="w-5 h-5" /> Simpan Perjanjian</>
          )}
        </button>
      </div>

      <div className="h-12" />
    </div>
  );
}
