import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface AnalysisResultProps {
  result: string;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  // Simple helper to style specific parts of the text response based on the Nutri Sincero format
  
  const getVerdictStyle = (text: string) => {
    if (text.includes('🔴') || text.includes('CILADA')) return 'bg-red-100 text-red-800 border-red-200';
    if (text.includes('🟡') || text.includes('MODERAÇÃO')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (text.includes('🟢') || text.includes('APROVADO')) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Naive markdown-like parsing for specific bold headers provided in prompt
  const formatText = (text: string) => {
    // Split by lines to process headers
    return text.split('\n').map((line, index) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('**VEREDITO:**')) {
        const content = trimmed.replace('**VEREDITO:**', '').trim();
        return (
          <div key={index} className={`p-4 rounded-lg border-l-4 mb-4 font-bold text-lg shadow-sm flex items-center gap-2 ${getVerdictStyle(content)}`}>
            {content}
          </div>
        );
      }
      
      if (trimmed.startsWith('**A Verdade Nua e Crua:**')) {
        return <h3 key={index} className="text-gray-900 font-bold mt-6 mb-2 flex items-center gap-2"><Info className="w-5 h-5 text-blue-600"/> A Verdade Nua e Crua:</h3>;
      }
      
      if (trimmed.startsWith('**Os Detalhes Sórdidos')) {
         return <h3 key={index} className="text-gray-900 font-bold mt-6 mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-orange-600"/> Os Detalhes Sórdidos:</h3>;
      }

      if (trimmed.startsWith('**Conclusão:**')) {
         return <h3 key={index} className="text-gray-900 font-bold mt-6 mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600"/> Conclusão:</h3>;
      }
      
      if (trimmed.startsWith('* 🚨')) {
        return <li key={index} className="ml-4 pl-2 border-l-2 border-red-400 text-gray-800 my-2 list-none">{trimmed.substring(2)}</li>
      }
      
      if (trimmed.startsWith('*')) {
        return <li key={index} className="ml-6 text-gray-700 my-1 list-disc">{trimmed.substring(1)}</li>
      }

      // Default paragraph
      if (trimmed.length > 0) {
        return <p key={index} className="text-gray-700 mb-2 leading-relaxed">{trimmed}</p>;
      }
      
      return null;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-900 p-4 border-b border-gray-800">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          📝 Análise do Nutri Sincero
        </h2>
      </div>
      <div className="p-6">
        <div className="prose prose-sm sm:prose-base max-w-none">
          {formatText(result)}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
