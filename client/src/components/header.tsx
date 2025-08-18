export default function Header() {
  return (
    <header className="bg-gradient-to-r from-isd-teal via-teal-700 to-teal-600 text-white shadow-lg h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            {/* Instituto Santos Dumont Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-isd-orange to-yellow-400 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">ISD</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">INSTITUTO</h1>
                <h2 className="text-lg font-medium text-orange-200">SANTOS DUMONT</h2>
                <p className="text-xs text-teal-100">ENSINO E PESQUISA</p>
              </div>
            </div>
            <div className="hidden md:block h-8 w-px bg-teal-300"></div>
            <div className="hidden md:block">
              <h3 className="text-lg font-semibold text-white">Explorador Geográfico de Qualidade da Água</h3>
              <p className="text-sm text-teal-100">Monitoramento da qualidade da água no Brasil</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="px-3 py-1 text-sm border border-teal-300 rounded-md bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all">
              PT
            </button>
            <div className="flex space-x-2 text-sm text-teal-100">
              <span className="hover:text-white cursor-pointer">ENG</span>
              <span className="hover:text-white cursor-pointer">ESP</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}