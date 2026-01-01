import React from 'react';
import { Skull, Leaf } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 p-2 rounded-lg text-white">
            <Skull size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">Nutri Sincero</h1>
            <p className="text-xs text-gray-500 font-medium">Sem health-washing.</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-green-700 font-semibold text-sm bg-green-50 px-3 py-1 rounded-full">
          <Leaf size={16} />
          <span>A verdade dói, mas cura</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
