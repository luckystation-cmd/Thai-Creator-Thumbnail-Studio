
import React, { useState, useRef } from 'react';
import Header from './components/Header';
import { Expression, GeneratedImage, ReferenceImage, StyleOption, BeautySettings } from './types';
import { DEFAULT_EXPRESSIONS, OUTFIT_STYLES } from './constants';
import { generateExpressionImage } from './services/geminiService';

const App: React.FC = () => {
  const [refImages, setRefImages] = useState<ReferenceImage[]>([]);
  const [expressions, setExpressions] = useState<Expression[]>(DEFAULT_EXPRESSIONS);
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(OUTFIT_STYLES[0]);
  const [isCustomStyle, setIsCustomStyle] = useState(false);
  const [customStyleText, setCustomStyleText] = useState('');
  const [isEnhanceEnabled, setIsEnhanceEnabled] = useState(false);
  
  const [beautySettings, setBeautySettings] = useState<BeautySettings>({
    smoothSkin: false,
    whiteSkin: false,
    removeBlemishes: false,
    noBeard: false,
  });

  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 3 - refImages.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots) as File[];

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        const newImg: ReferenceImage = {
          id: Math.random().toString(36).substr(2, 9),
          base64,
          previewUrl: reader.result as string,
          mimeType: file.type
        };
        setRefImages(prev => [...prev, newImg].slice(0, 3));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    setRefImages(prev => prev.filter(img => img.id !== id));
  };

  const toggleBeauty = (key: keyof BeautySettings) => {
    setBeautySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleExpression = (id: string) => {
    setExpressions(prev => prev.map(exp => 
      exp.id === id ? { ...exp, isSelected: !exp.isSelected } : exp
    ));
  };

  const selectAll = () => {
    setExpressions(prev => prev.map(exp => ({ ...exp, isSelected: true })));
  };

  const clearSelection = () => {
    setExpressions(prev => prev.map(exp => ({ ...exp, isSelected: false })));
  };

  const handleGenerate = async () => {
    if (refImages.length === 0) {
      alert('กรุณาอัปโหลดรูปต้นแบบอย่างน้อย 1 รูป');
      return;
    }
    const selected = expressions.filter(e => e.isSelected);
    if (selected.length === 0) {
      alert('กรุณาเลือกอย่างน้อย 1 อารมณ์');
      return;
    }

    if (isCustomStyle && !customStyleText.trim()) {
      alert('กรุณาระบุชุดแต่งกายที่ต้องการ');
      return;
    }

    setIsGenerating(true);
    
    const finalStyleLabel = isCustomStyle ? `ชุดแต่งเอง: ${customStyleText}` : selectedStyle.label;
    const finalStylePrompt = isCustomStyle ? `wearing ${customStyleText}` : selectedStyle.prompt;

    const newBatchId = Date.now().toString();
    const newResults: GeneratedImage[] = selected.map(exp => ({
      id: `${newBatchId}-${exp.id}`,
      expressionLabel: exp.label,
      styleLabel: finalStyleLabel,
      url: '',
      status: 'loading'
    }));
    
    setResults(prev => [...newResults, ...prev]);

    const promises = selected.map(async (exp, index) => {
      const resultId = newResults[index].id;
      try {
        const imageUrl = await generateExpressionImage(
          refImages.map(img => ({ base64: img.base64, mimeType: img.mimeType })),
          exp.prompt,
          finalStylePrompt,
          isEnhanceEnabled,
          beautySettings
        );
        
        setResults(prev => prev.map(item => 
          item.id === resultId ? { ...item, url: imageUrl, status: 'completed' } : item
        ));
      } catch (err: any) {
        setResults(prev => prev.map(item => 
          item.id === resultId ? { ...item, status: 'error', error: err.message || 'เกิดข้อผิดพลาดในการประมวลผล' } : item
        ));
      }
    });

    await Promise.all(promises);
    setIsGenerating(false);
  };

  const downloadImage = (url: string, label: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `thumbnail-${label}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro Section */}
        <section className="mb-12 text-center py-10">
          <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent">
            AI Generative Expression Studio
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
            เปลี่ยนรูปถ่ายเพียงรูปเดียวของคุณ ให้เป็นรูปหน้าปกคลิปอารมณ์ต่างๆ ได้ในไม่กี่วินาที 
            พร้อมคงเอกลักษณ์ใบหน้าเดิมไว้ 100% ประหยัดเวลาไม่ต้องถ่ายใหม่หลายรอบ
          </p>
        </section>

        <div className="grid lg:grid-cols-12 gap-8 mb-20">
          {/* Sidebar: Controls */}
          <div className="lg:col-span-5 space-y-6">
            <section className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-blue-600 text-[10px] flex items-center justify-center font-black">1</span>
                  รูปต้นแบบ (สูงสุด 3 รูป)
                </h2>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={refImages.length >= 3}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                    refImages.length >= 3 ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                  }`}
                >
                  <i className="fa-solid fa-plus mr-1"></i> เพิ่มรูป
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {refImages.map((img) => (
                  <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
                    <img src={img.previewUrl} className="w-full h-full object-cover" alt="ref" />
                    <button 
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <i className="fa-solid fa-xmark text-[10px]"></i>
                    </button>
                  </div>
                ))}
                {refImages.length < 3 && (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
                  >
                    <i className="fa-solid fa-camera text-slate-500 text-xl mb-1"></i>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">อัปโหลด</span>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" multiple className="hidden" />
            </section>

            <section className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-pink-600 text-[10px] flex items-center justify-center font-black">2</span>
                แต่งผิวหน้า & ความหล่อสวย
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => toggleBeauty('smoothSkin')} className={`flex items-center gap-2 p-3 rounded-2xl border transition-all text-xs font-bold ${beautySettings.smoothSkin ? 'bg-pink-600/10 border-pink-600/50 text-pink-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}><i className="fa-solid fa-sparkles"></i> ผิวเนียนใส</button>
                <button onClick={() => toggleBeauty('whiteSkin')} className={`flex items-center gap-2 p-3 rounded-2xl border transition-all text-xs font-bold ${beautySettings.whiteSkin ? 'bg-pink-600/10 border-pink-600/50 text-pink-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}><i className="fa-solid fa-sun"></i> ผิวขาวกระจ่างใส</button>
                <button onClick={() => toggleBeauty('removeBlemishes')} className={`flex items-center gap-2 p-3 rounded-2xl border transition-all text-xs font-bold ${beautySettings.removeBlemishes ? 'bg-pink-600/10 border-pink-600/50 text-pink-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}><i className="fa-solid fa-eraser"></i> ลบฝ้า/กระ/จุดด่างดำ</button>
                <button onClick={() => toggleBeauty('noBeard')} className={`flex items-center gap-2 p-3 rounded-2xl border transition-all text-xs font-bold ${beautySettings.noBeard ? 'bg-pink-600/10 border-pink-600/50 text-pink-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}><i className="fa-solid fa-user-slash"></i> หน้าเกลี้ยงเกลา (ลบหนวด)</button>
              </div>
            </section>

            <section className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-orange-600 text-[10px] flex items-center justify-center font-black">3</span>
                ตั้งค่าชุดและการแต่งภาพ
              </h2>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">สไตล์ชุดแต่งกาย</label>
                    <button onClick={() => setIsCustomStyle(!isCustomStyle)} className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${isCustomStyle ? 'bg-blue-600 text-white' : 'text-blue-400 hover:bg-blue-600/10'}`}>{isCustomStyle ? 'ยกเลิกเขียนเอง' : 'เขียนชุดเอง'}</button>
                  </div>
                  {isCustomStyle ? (
                    <input type="text" value={customStyleText} onChange={(e) => setCustomStyleText(e.target.value)} placeholder="เช่น ชุดพนักงานออฟฟิศ, ชุดไทยสีแดง..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {OUTFIT_STYLES.map((style) => (
                        <button key={style.id} onClick={() => setSelectedStyle(style)} className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${selectedStyle.id === style.id ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}><span className="text-xl mb-1">{style.icon}</span><span className="text-[8px] font-bold truncate w-full text-center">{style.label.split(' ')[0]}</span></button>
                      ))}
                    </div>
                  )}
                </div>
                <div onClick={() => setIsEnhanceEnabled(!isEnhanceEnabled)} className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer border transition-all ${isEnhanceEnabled ? 'bg-orange-500/10 border-orange-500/40 text-orange-400' : 'bg-slate-800/40 border-slate-800 text-slate-500 hover:border-slate-700'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isEnhanceEnabled ? 'bg-orange-500 text-white' : 'bg-slate-800'}`}><i className="fa-solid fa-wand-magic-sparkles text-sm"></i></div>
                    <div><p className="text-xs font-bold">โหมดภาพสตูดิโอ (High Quality)</p><p className="text-[9px] opacity-70">แสงเงาระดับพรีเมียม</p></div>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative transition-colors p-1 ${isEnhanceEnabled ? 'bg-orange-500' : 'bg-slate-700'}`}><div className={`absolute w-3 h-3 bg-white rounded-full transition-all top-1 ${isEnhanceEnabled ? 'right-1' : 'left-1'}`}></div></div>
                </div>
              </div>
            </section>

            <section className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-purple-600 text-[10px] flex items-center justify-center font-black">4</span>
                  เลือกอารมณ์ใบหน้า
                </h2>
                <div className="flex gap-2"><button onClick={selectAll} className="text-[10px] text-blue-400 hover:underline font-bold">เลือกทั้งหมด</button><button onClick={clearSelection} className="text-[10px] text-slate-500 hover:underline font-bold">ล้าง</button></div>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                {expressions.map((exp) => (
                  <button key={exp.id} onClick={() => toggleExpression(exp.id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition-all border ${exp.isSelected ? 'bg-blue-600 border-blue-400 text-white shadow-md' : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-600'}`}><span className="text-lg">{exp.icon}</span><span className="font-bold truncate">{exp.label}</span></button>
                ))}
              </div>
              <div className="mt-6">
                <button disabled={refImages.length === 0 || expressions.filter(e => e.isSelected).length === 0 || isGenerating} onClick={handleGenerate} className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${refImages.length === 0 || expressions.filter(e => e.isSelected).length === 0 || isGenerating ? 'bg-slate-800 text-slate-600 cursor-not-allowed grayscale' : 'bg-gradient-to-r from-red-600 to-orange-500 text-white hover:scale-[1.02] shadow-xl shadow-red-900/20 active:scale-95'}`}>
                  {isGenerating ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> AI กำลังทำงาน...</> : <><i className="fa-solid fa-bolt"></i> สร้างรูปภาพปกคลิป</>}
                </button>
              </div>
            </section>
          </div>

          {/* Results Gallery */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/40 rounded-[2.5rem] p-6 md:p-10 border border-slate-800 min-h-[700px] backdrop-blur-xl relative">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div><h2 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">คลังผลลัพธ์{results.length > 0 && <span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full font-bold">{results.length}</span>}</h2><p className="text-slate-500 text-xs mt-1">รูปภาพที่สร้างสำเร็จจะปรากฏที่นี่</p></div>
                {results.length > 0 && <button onClick={() => setResults([])} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-red-900/30 text-slate-400 hover:text-red-400 border border-slate-700 transition-all text-xs font-bold"><i className="fa-solid fa-trash-can"></i> ล้างรูปทั้งหมด</button>}
              </div>
              {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[500px] text-slate-700"><div className="w-24 h-24 rounded-full bg-slate-800/30 flex items-center justify-center mb-6 border border-slate-800"><i className="fa-solid fa-images text-4xl opacity-30"></i></div><p className="text-lg font-bold">ผลลัพธ์ของคุณจะปรากฏที่นี่</p></div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {results.map((img) => (
                    <div key={img.id} className="bg-slate-800/40 rounded-3xl overflow-hidden border border-slate-700/30 shadow-2xl group relative">
                      <div className="aspect-[4/3] bg-slate-950 flex items-center justify-center overflow-hidden relative">
                        {img.status === 'loading' ? (
                          <div className="flex flex-col items-center gap-4"><div className="w-16 h-16 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div><p className="text-blue-400 text-xs font-bold uppercase">{img.expressionLabel.split('(')[0]}</p></div>
                        ) : img.status === 'error' ? (
                          <div className="p-8 text-center"><i className="fa-solid fa-triangle-exclamation text-red-500 text-2xl mb-2"></i><p className="text-red-400 text-xs">{img.error}</p></div>
                        ) : (
                          <>
                            <img src={img.url} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" alt="result" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                              <div className="flex justify-between items-end">
                                <div><p className="text-white font-black text-xl">{img.expressionLabel.split('(')[0]}</p><p className="text-blue-400 text-[10px] font-bold">{img.styleLabel}</p></div>
                                <button onClick={() => downloadImage(img.url, img.expressionLabel)} className="w-12 h-12 bg-white text-slate-950 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><i className="fa-solid fa-download text-lg"></i></button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      {img.status === 'completed' && <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10"><span className="text-[10px] font-bold text-white uppercase">{img.expressionLabel.split('(')[0]}</span></div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="mb-24 py-20 border-y border-slate-900">
          <div className="text-center mb-12">
            <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.3em]">Special Features</span>
            <h2 className="text-3xl md:text-5xl font-black mt-2">ฟีเจอร์เด่นเพื่อชาว Creator</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'fa-id-card', title: 'Face ID Lock', desc: 'ระบบ AI ขั้นสูงคงเอกลักษณ์ใบหน้าเดิมไว้ 100% ไม่ต้องกลัวหน้าเปลี่ยน' },
              { icon: 'fa-wand-magic-sparkles', title: 'Beauty Retouch', desc: 'ปรับผิวเนียน กระจ่างใส ลบหนวดเครา ให้คุณดูดีที่สุดในปกคลิป' },
              { icon: 'fa-shirt', title: 'Outfit Swap', desc: 'เปลี่ยนชุดแต่งกายได้หลากหลายสไตล์ ไม่ว่าจะเป็นชุดสูท สตรีท หรือแฟนตาซี' },
              { icon: 'fa-layer-group', title: 'Batch Generate', desc: 'สร้างอารมณ์ที่แตกต่างกันได้หลายรูปพร้อมกันในคลิกเดียว' }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-900/40 p-8 rounded-[2rem] border border-slate-800 hover:border-slate-700 transition-all">
                <div className="w-12 h-12 bg-red-600/20 text-red-500 rounded-2xl flex items-center justify-center text-xl mb-6">
                  <i className={`fa-solid ${feature.icon}`}></i>
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to use Section */}
        <section id="how-to-use" className="mb-24 px-4">
          <div className="text-center mb-16">
            <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em]">Guide</span>
            <h2 className="text-3xl md:text-5xl font-black mt-2">วิธีใช้งานเบื้องต้น</h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-12">
            {[
              { step: '01', title: 'อัปโหลดรูปต้นแบบ', desc: 'อัปโหลดรูปภาพใบหน้าของคุณ 1-3 รูป แนะนำให้อัปโหลดหลายมุมเพื่อความแม่นยำสูงสุด' },
              { step: '02', title: 'ปรับแต่งโหมดบิวตี้และชุด', desc: 'เลือกโหมดปรับผิวเนียน หรือเปลี่ยนชุดแต่งกายตามธีมของคลิปวิดีโอ' },
              { step: '03', title: 'เลือกอารมณ์ที่ต้องการ', desc: 'เลือกอารมณ์ต่างๆ ที่ต้องการให้แสดงบนหน้าปก เช่น ตกใจ, ดีใจ, หรือสงสัย' },
              { step: '04', title: 'กดสร้างและดาวน์โหลด', desc: 'รอ AI ประมวลผลสักครู่ แล้วดาวน์โหลดรูปไปทำหน้าปกคลิปได้ทันที!' }
            ].map((item, i) => (
              <div key={i} className="flex gap-8 group">
                <div className="text-4xl md:text-6xl font-black text-slate-800 group-hover:text-red-600 transition-colors shrink-0">
                  {item.step}
                </div>
                <div className="pt-2">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 pt-20 pb-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-red-600 p-2 rounded-lg"><i className="fa-solid fa-play text-white"></i></div>
                <h1 className="text-xl font-bold text-white">Thumbnail Studio</h1>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                เครื่องมือ AI ทรงพลังที่ออกแบบมาเพื่อช่วยเหลือ Content Creator ชาวไทย 
                ในการสร้างสรรค์หน้าปกวิดีโอคุณภาพสูงที่ดึงดูดสายตาและคงความเป็นตัวเอง
              </p>
            </div>
            
            <div id="contact">
              <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6">ติดต่อเรา / ติดตามผลงาน</h4>
              <ul className="space-y-4">
                <li>
                  <a href="https://www.facebook.com/luckystation88" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-400 hover:text-blue-500 transition-colors text-sm">
                    <i className="fa-brands fa-facebook text-xl"></i>
                    <span>luckystation88</span>
                  </a>
                </li>
                <li>
                  <div className="flex items-center gap-3 text-slate-400 text-sm">
                    <i className="fa-brands fa-line text-xl text-green-500"></i>
                    <span>Line ID: <strong className="text-white">mylucky14</strong></span>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6">About Creator</h4>
              <p className="text-slate-500 text-sm">
                พัฒนาโดยทีมงานที่เข้าใจ YouTuber 
                เน้นความรวดเร็ว คุณภาพ และการใช้งานที่ง่ายที่สุด
              </p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-900 text-slate-700 text-[10px] text-center font-bold uppercase tracking-[0.2em]">
            © 2025 Creator Expression Studio - AI Powered Portrait Engine for YouTubers
          </div>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.5); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(51, 65, 85, 0.8); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(71, 85, 105, 1); }
      `}</style>
    </div>
  );
};

export default App;
