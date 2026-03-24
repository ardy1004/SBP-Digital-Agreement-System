import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateAgreement, useListAgreements, type CreateAgreementRequest } from "@workspace/api-client-react";
import { formatIndonesianDate, formatRupiah } from "@/lib/utils";
import { Copy, Plus, Send, ExternalLink, RefreshCw, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  nama_owner: z.string().min(3, "Nama lengkap wajib diisi"),
  nik: z.string().min(16, "NIK minimal 16 digit").max(16, "NIK maksimal 16 digit"),
  alamat_owner: z.string().min(5, "Alamat wajib diisi"),
  jenis_properti: z.string().min(3, "Jenis properti wajib diisi (contoh: Rumah, Tanah)"),
  luas_tanah: z.string().min(2, "Luas tanah/bangunan wajib diisi"),
  legalitas: z.string().min(2, "Legalitas wajib diisi (SHM, SHGB, dll)"),
  alamat_properti: z.string().min(5, "Alamat properti wajib diisi"),
  harga_nett: z.string().min(1, "Harga NETT wajib diisi"),
  tanggal_perjanjian: z.string().min(1, "Tanggal perjanjian wajib diisi"),
});

export default function AdminPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');
  const [newLink, setNewLink] = useState<string | null>(null);

  const { data: agreements, isLoading, refetch } = useListAgreements();
  const createMutation = useCreateAgreement({
    mutation: {
      onSuccess: (data) => {
        const link = `${window.location.origin}${import.meta.env.BASE_URL}agreement/${data.id}`;
        setNewLink(link);
        toast({
          title: "Sukses!",
          description: "Perjanjian berhasil dibuat.",
        });
        refetch();
        form.reset();
      },
      onError: (error) => {
        toast({
          title: "Gagal membuat perjanjian",
          description: error.message || "Terjadi kesalahan",
          variant: "destructive"
        });
      }
    }
  });

  const form = useForm<CreateAgreementRequest>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_owner: "",
      nik: "",
      alamat_owner: "",
      jenis_properti: "",
      luas_tanah: "",
      legalitas: "SHM",
      alamat_properti: "",
      harga_nett: "5000000000",
      tanggal_perjanjian: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = (data: CreateAgreementRequest) => {
    createMutation.mutate({ data });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Tersalin!",
      description: "Link berhasil disalin ke clipboard.",
    });
  };

  const openWhatsApp = (link: string) => {
    const message = `Halo Pak/Bu, berikut perjanjian pemasaran properti Anda dari CV Salam Bumi Property. Silakan dibaca dan langsung tanda tangan secara digital melalui link berikut:\n\n${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-primary text-primary-foreground py-6 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <img src="/api/assets/logo" alt="SBP Logo" className="w-12 h-12 bg-white rounded-full p-1 object-contain" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">SBP Agreement System</h1>
              <p className="text-primary-foreground/80 text-sm">Digital Document Management</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Form */}
          <div className="lg:col-span-7">
            <div className="bg-card rounded-2xl shadow-xl shadow-black/5 border border-border/50 overflow-hidden">
              <div className="p-6 border-b border-border/50 bg-slate-50/50">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Buat Perjanjian Baru
                </h2>
              </div>
              
              <div className="p-6">
                {newLink ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-800 mb-2">Perjanjian Berhasil Dibuat!</h3>
                    <p className="text-green-600 mb-6">Bagikan link ini kepada pemilik properti untuk ditandatangani.</p>
                    
                    <div className="flex items-center justify-center gap-2 mb-6 bg-white p-3 rounded-lg border border-green-100 shadow-inner">
                      <code className="text-sm text-slate-700 truncate max-w-xs">{newLink}</code>
                      <button 
                        onClick={() => copyToClipboard(newLink)}
                        className="p-2 hover:bg-slate-100 rounded-md transition-colors"
                        title="Copy Link"
                      >
                        <Copy className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                    
                    <div className="flex justify-center gap-4">
                      <button 
                        onClick={() => openWhatsApp(newLink)}
                        className="px-6 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-medium shadow-lg shadow-[#25D366]/20 transition-all flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <Send className="w-4 h-4" />
                        Kirim via WhatsApp
                      </button>
                      <button 
                        onClick={() => setNewLink(null)}
                        className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
                      >
                        Buat Lainnya
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">Data Pemilik (Pihak Kedua)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Nama Sesuai KTP</label>
                          <input 
                            {...form.register("nama_owner")}
                            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="John Doe"
                          />
                          {form.formState.errors.nama_owner && <p className="text-xs text-destructive">{form.formState.errors.nama_owner.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Nomor Induk Kependudukan (NIK)</label>
                          <input 
                            {...form.register("nik")}
                            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="16 Digit NIK"
                          />
                          {form.formState.errors.nik && <p className="text-xs text-destructive">{form.formState.errors.nik.message}</p>}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Alamat Sesuai KTP</label>
                        <textarea 
                          {...form.register("alamat_owner")}
                          rows={2}
                          className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                          placeholder="Jl. Merdeka No. 123, RT 01/RW 02..."
                        />
                        {form.formState.errors.alamat_owner && <p className="text-xs text-destructive">{form.formState.errors.alamat_owner.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">Data Properti</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Jenis Properti</label>
                          <input 
                            {...form.register("jenis_properti")}
                            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="Rumah Tinggal"
                          />
                          {form.formState.errors.jenis_properti && <p className="text-xs text-destructive">{form.formState.errors.jenis_properti.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Luas Tanah/Bangunan</label>
                          <input 
                            {...form.register("luas_tanah")}
                            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="100 m2 / 80 m2"
                          />
                          {form.formState.errors.luas_tanah && <p className="text-xs text-destructive">{form.formState.errors.luas_tanah.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Legalitas</label>
                          <select 
                            {...form.register("legalitas")}
                            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          >
                            <option value="SHM">SHM</option>
                            <option value="SHGB">SHGB</option>
                            <option value="Letter C">Letter C</option>
                            <option value="Lainnya">Lainnya</option>
                          </select>
                          {form.formState.errors.legalitas && <p className="text-xs text-destructive">{form.formState.errors.legalitas.message}</p>}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Alamat Lengkap Properti</label>
                        <textarea 
                          {...form.register("alamat_properti")}
                          rows={2}
                          className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                          placeholder="Lokasi detail properti yang dipasarkan..."
                        />
                        {form.formState.errors.alamat_properti && <p className="text-xs text-destructive">{form.formState.errors.alamat_properti.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-2">Kesepakatan</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Harga NETT Owner (Rp)</label>
                          <input 
                            {...form.register("harga_nett")}
                            type="number"
                            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="5000000000"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Preview: {formatRupiah(form.watch("harga_nett") || "0")}</p>
                          {form.formState.errors.harga_nett && <p className="text-xs text-destructive">{form.formState.errors.harga_nett.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Tanggal Perjanjian</label>
                          <input 
                            {...form.register("tanggal_perjanjian")}
                            type="date"
                            className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          />
                          {form.formState.errors.tanggal_perjanjian && <p className="text-xs text-destructive">{form.formState.errors.tanggal_perjanjian.message}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        disabled={createMutation.isPending}
                        className="px-8 py-3 rounded-xl font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:transform-none transition-all w-full md:w-auto"
                      >
                        {createMutation.isPending ? "Menyimpan..." : "Buat & Generate Link"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - List */}
          <div className="lg:col-span-5">
            <div className="bg-card rounded-2xl shadow-xl shadow-black/5 border border-border/50 flex flex-col h-full max-h-[800px]">
              <div className="p-6 border-b border-border/50 bg-slate-50/50 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Riwayat Perjanjian</h2>
                <button 
                  onClick={() => refetch()} 
                  className="p-2 text-muted-foreground hover:bg-slate-200 rounded-full transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              
              <div className="overflow-y-auto p-4 flex-1 space-y-3">
                {isLoading ? (
                  <div className="flex justify-center p-8">
                    <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : agreements && agreements.length > 0 ? (
                  agreements.map((agr) => (
                    <div key={agr.id} className="p-4 border border-border/60 rounded-xl hover:border-primary/30 hover:shadow-md transition-all bg-background group">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-foreground line-clamp-1">{agr.nama_owner}</p>
                          <p className="text-xs text-muted-foreground">{agr.nomor}</p>
                        </div>
                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${agr.status === 'signed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {agr.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-4 line-clamp-1">
                        {agr.jenis_properti} - {agr.alamat_properti}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(`${window.location.origin}${import.meta.env.BASE_URL}agreement/${agr.id}`)}
                          className="flex-1 py-2 px-3 text-xs font-medium border border-border rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 text-slate-600"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          Copy Link
                        </button>
                        <a
                          href={`${import.meta.env.BASE_URL}agreement/${agr.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 text-xs font-medium border border-border rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 text-slate-600"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Lihat
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-8 text-muted-foreground">
                    <p>Belum ada data perjanjian.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
