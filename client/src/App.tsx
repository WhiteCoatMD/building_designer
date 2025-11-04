import { Building3D } from './components/Building3D';
import { ControlPanel } from './components/ControlPanel';
import { useEffect } from 'react';
import { useBuildingStore } from './store/buildingStore';

function App() {
  const calculatePrice = useBuildingStore((state) => state.calculatePrice);

  // Calculate initial price on mount
  useEffect(() => {
    calculatePrice();
  }, [calculatePrice]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Portable Building Designer</h1>
            <p className="text-sm text-blue-100">Design your perfect shed or cabin</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-blue-100">Need help?</div>
            <div className="text-lg font-semibold">1-800-SHEDS-4U</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* 3D Viewer */}
        <div className="flex-1 relative">
          <Building3D />

          {/* Instructions Overlay */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg max-w-xs">
            <div className="text-sm font-medium text-gray-800 mb-2">
              3D Viewer Controls
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• <strong>Rotate:</strong> Click and drag</li>
              <li>• <strong>Zoom:</strong> Scroll wheel</li>
              <li>• <strong>Pan:</strong> Right-click and drag</li>
            </ul>
          </div>
        </div>

        {/* Control Panel - Desktop */}
        <div className="hidden lg:block w-96 border-l border-gray-300 bg-white overflow-hidden">
          <ControlPanel />
        </div>

        {/* Control Panel - Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 max-h-[50vh] overflow-y-auto shadow-xl">
          <ControlPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
