import { useRef, useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useGetAgreement, useSignAgreement } from "@workspace/api-client-react";
import SignatureCanvas from "react-signature-canvas";
import { DocumentTemplate } from "@/components/DocumentTemplate";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle, PenTool, Check } from "lucide-react";
import { useLocation } from "wouter";

export default function SigningPage() {
  const [, params] = useRoute("/agreement/:id");
  const id = params?.id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: agreement, isLoading, isError } = useGetAgreement(id || "");
  const signMutation = useSignAgreement();
  
  const sigCanvasRef = useRef<SignatureCanvas>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already signed, redirect to success immediately
  useEffect(() => {
    if (agreement?.status === "signed") {
      setLocation(`/agreement/${id}/success`);
    }
  }, [agreement, id, setLocation]);

  const handleClearSignature = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
    }
  };

  const handleSign = async () => {
    if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
      toast({
        title: "Tanda Tangan Kosong",
        description: "Silakan bubuhkan tanda tangan Anda terlebih dahulu pada kotak yang disediakan.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const signatureData = sigCanvasRef.current.getTrimmedCanvas().toDataURL("image/png");
      
      await signMutation.mutateAsync({
        id: id as string,
        data: { signature_data: signatureData }
      });
      
      toast({
        title: "Berhasil",
        description: "Perjanjian berhasil ditandatangani!",
      });
      
      setLocation(`/agreement/${id}/success`);
    } catch (error: any) {
      toast({
        title: "Gagal Menandatangani",
        description: error.message || "Terjadi kesalahan sistem",
        variant: "destructive"
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
    // Return null while redirecting
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-8 flex flex-col items-center">
      <div className="w-full max-w-[794px] mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tanda Tangan Digital</h1>
          <p className="text-slate-500 text-sm mt-1">Silakan baca seluruh pasal sebelum menandatangani.</p>
        </div>
      </div>

      {/* A4 Container Wrapper for responsivenes */}
      <div className="w-full overflow-x-auto pb-8 flex justify-center custom-scrollbar">
        <div className="shadow-2xl shadow-black/10 origin-top">
          <DocumentTemplate 
            agreement={agreement} 
            isSigning={true}
            signatureCanvasRef={sigCanvasRef}
            onClearSignature={handleClearSignature}
          />
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-slate-600">
            <div className="bg-amber-100 p-2 rounded-full text-amber-600">
              <PenTool className="w-5 h-5" />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-slate-800">Menunggu Tanda Tangan</p>
              <p className="hidden sm:block">Gambar tanda tangan Anda pada area bermaterai di atas.</p>
            </div>
          </div>
          <button
            onClick={handleSign}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:transform-none"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</>
            ) : (
              <><Check className="w-5 h-5" /> Tandatangani Perjanjian</>
            )}
          </button>
        </div>
      </div>
      
      {/* Padding for fixed bottom bar */}
      <div className="h-24"></div>
    </div>
  );
}
