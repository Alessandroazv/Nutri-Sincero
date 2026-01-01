import React, { useState } from 'react';
import Header from './components/Header';
import GoalSelector from './components/GoalSelector';
import ImageUploader from './components/ImageUploader';
import AnalysisResult from './components/AnalysisResult';
import { GoalType, ImageFile, AnalysisState } from './types';
import { analyzeFoodLabel } from './services/geminiService';
import { ScanSearch, RotateCcw, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null,
  });

  const handleAnalyze = async () => {
    if (!selectedGoal || !imageFile) return;

    setAnalysisState({ isLoading: true, error: null, result: null });

    try {
      // Clean base64 string (remove data:image/jpeg;base64, prefix)
      const base64Data = imageFile.base64.split(',')[1];
      const mimeType = imageFile.base64.split(';')[0].split(':')[1];

      const result = await analyzeFoodLabel(base64Data, selectedGoal, mimeType);
      
      setAnalysisState({
        isLoading: false,
        error: null,
        result: result
      });
    } catch (error) {
      setAnalysisState({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
        result: null
      });
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setAnalysisState({ isLoading: false, error: null, result: null });
    // Keep goal selected for convenience
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-12">
      <Header />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 pt-6 space-y-8">
        
        {/* Intro Text */}
        {!analysisState.result && !analysisState.isLoading && (
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Vamos desmascarar esse rótulo?</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Selecione seu objetivo, tire uma foto dos ingredientes e da tabela nutricional. Eu te conto a verdade.
            </p>
          </div>
        )}

        {/* Configuration Section (Hidden if has result) */}
        {!analysisState.result && (
          <div className={`space-y-8 transition-opacity duration-300 ${analysisState.isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <GoalSelector selectedGoal={selectedGoal} onSelect={setSelectedGoal} />
            
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider ml-1">Imagem do Produto</h3>
              <ImageUploader imageFile={imageFile} onImageSelected={setImageFile} />
            </div>

            <div className="pt-4 sticky bottom-6 z-40">
              <button
                onClick={handleAnalyze}
                disabled={!selectedGoal || !imageFile || analysisState.isLoading}
                className={`
                  w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all transform active:scale-95
                  ${(!selectedGoal || !imageFile) 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-red-600 text-white hover:bg-red-700 shadow-red-200 hover:shadow-red-300'
                  }
                `}
              >
                {analysisState.isLoading ? (
                  <>
                    <Loader2 className="animate-spin" /> Analisando mentiras...
                  </>
                ) : (
                  <>
                    <ScanSearch /> Analisar Rótulo
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Loading State Overlay */}
        {analysisState.isLoading && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-sm border border-red-100">
              <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Julgando suas escolhas...</h3>
              <p className="text-gray-600">Lendo os ingredientes miúdos que eles tentaram esconder de você.</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {analysisState.result && (
          <div className="space-y-6 animate-fade-in-up">
            <AnalysisResult result={analysisState.result} />
            
            <button
              onClick={handleReset}
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <RotateCcw size={20} /> Analisar Outro Produto
            </button>
          </div>
        )}

        {/* Error State */}
        {analysisState.error && !analysisState.isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
            <p className="font-bold mb-2">Ocorreu um erro</p>
            <p className="text-sm">{analysisState.error}</p>
            <button 
              onClick={() => setAnalysisState(prev => ({ ...prev, error: null }))}
              className="mt-4 text-sm font-semibold underline hover:text-red-900"
            >
              Tentar novamente
            </button>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
