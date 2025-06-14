import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import AddTradeDialog from './components/AddTradeDialog';
import Trades from './components/Trades';
import { Trade } from './types';
import { axiosInstance } from './api/base';
import toast, { Toaster } from 'react-hot-toast';

function App () {
  const [ isDialogOpen, setIsDialogOpen ] = useState( false );
  const [ trades, setTrades ] = useState<Trade[]>( [] );

  const fetchTrades = async () => {
    try {
      const response = await axiosInstance.get( '/trade' );
      setTrades( response.data.payload );
    } catch ( error ) {
      console.error( 'Error fetching trades:', error );
    }
  };

  useEffect( () => {
    fetchTrades();
  }, [] );

  const handleAddTrade = () => {
    setIsDialogOpen( false );
  };

  const handleTradeTempor = () => {
    fetchTrades();
  };

  const handleShowNotification = ( message: string, type: 'success' | 'error' ) => {
    if ( type === 'success' ) {
      toast.success( message, {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#4CAF50',
          color: '#fff',
        },
      } );
    } else if ( type === 'error' ) {
      toast.error( message, {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#F44336',
          color: '#fff',
        },
      } );
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-7">
          <div>
            <h1 className="text-3xl font-bold mb-1">FOREX TRADING TERMINAL v1.0</h1>
            <p className="text-green-300">©2025 Wilgax®</p>
          </div>
          <button
            className="retro-button"
            onClick={() => setIsDialogOpen( true )}
          >
            <Plus className="inline-block mr-2" size={16} />
            NEW TRADE
          </button>
        </div>

        <Trades trades={trades} isExitTrade={handleTradeTempor} onShowNotification={handleShowNotification} />

        <AddTradeDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen( false )}
          onSubmit={handleAddTrade}
          onTradeAdded={handleTradeTempor}
          onShowNotification={handleShowNotification}
        />

        <Toaster />
      </div>
    </div>
  );
}

export default App;
