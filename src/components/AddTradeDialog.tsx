import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { TradeFormData } from '../types';
import { axiosInstance } from '../api/base';
import { STRATEGIES } from '../config';
import Button from './Button';

interface AddTradeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: ( data: TradeFormData ) => void;
  onTradeAdded: () => void;
  onShowNotification: ( message: string, type: 'success' | 'error' ) => void;
}

export default function AddTradeDialog ( {
  open,
  onClose,
  onSubmit,
  onTradeAdded,
  onShowNotification,
}: AddTradeDialogProps ) {
  const [ formData, setFormData ] = useState<TradeFormData>( {
    symbol: '',
    GAP: 0,
    ECLIPSE_BUFFER: 0,
    volume: 0,
    strategy: '',
    direction: '',
  } );

  const [ isLoading, setIsLoading ] = useState( false );

  useEffect( () => {
    if ( open ) {
      const savedFormData = localStorage.getItem( 'lastTradeForm' );
      if ( savedFormData ) {
        setFormData( JSON.parse( savedFormData ) );
      }
    }
  }, [ open ] );

  if ( !open ) return null;

  const handleSubmit = async ( e: React.FormEvent ) => {
    e.preventDefault();

    setIsLoading( true );

    onSubmit( formData );

    localStorage.setItem( 'lastTradeForm', JSON.stringify( formData ) );

    try {
      const payload = { ...formData };

      // Clean the symbol before submission
      payload.symbol = payload.symbol.split( ' - ' )[ 0 ];

      // Remove GAP if strategy is STATIC (not required)
      if ( payload.strategy === 'STATIC' ) {
        delete payload.GAP;
      }

      // Remove direction if strategy is not REVERSAL
      if ( payload.strategy !== 'REVERSAL' ) {
        delete payload.direction;
      }

      await axiosInstance.post( '/trade', payload );
      onTradeAdded();
      onShowNotification( 'Trade executed successfully!', 'success' );
    } catch ( error ) {
      console.error( 'Error executing trade:', error );
      onShowNotification( 'Failed to execute trade.', 'error' );
    } finally {
      setIsLoading( false );
    }

    setFormData( {
      symbol: '',
      GAP: 0,
      ECLIPSE_BUFFER: 0,
      volume: 0,
      strategy: '',
      direction: '',
    } );
  };

  const onCloseDialog = () => {
    setFormData( { symbol: '', GAP: 0, ECLIPSE_BUFFER: 0, volume: 0, strategy: '' } );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="retro-panel w-[480px] relative">
        <div className="flex justify-between items-center mb-4 border-b-2 border-gray-600 pb-2">
          <h2 className="text-xl font-bold">NEW TRADE EXECUTION</h2>
          <button onClick={onCloseDialog} className="hover:text-green-300">
            <X size={25} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Currency Pair:</label>
            <input
              type="text"
              className="retro-input w-full"
              value={formData.symbol}
              onChange={( e ) => setFormData( { ...formData, symbol: e.target.value } )}
              placeholder="Enter a symbol from Exness MT5"
            />
          </div>

          <div>
            <label className="block mb-2">Strategy:</label>
            <div className="relative">
              <select
                className="retro-select w-full"
                value={formData.strategy}
                onChange={( e ) => setFormData( { ...formData, strategy: e.target.value } )}
              >
                <option value="">Select Strategy</option>
                {STRATEGIES.map( ( strategy ) => (
                  <option key={strategy} value={strategy}>
                    {strategy}
                  </option>
                ) )}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                ▼
              </div>
            </div>
          </div>

          {formData.strategy === 'REVERSAL' && (
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="retro-radio"
                  checked={formData.direction === 'BUY'}
                  onChange={() => setFormData( { ...formData, direction: 'BUY' } )}
                />
                <span className="text-pink-400 font-bold p-1">BUY</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="retro-radio"
                  checked={formData.direction === 'SELL'}
                  onChange={() => setFormData( { ...formData, direction: 'SELL' } )}
                />
                <span className="text-pink-400 font-bold p-1">SELL</span>
              </label>
            </div>
          )}

          {( formData.strategy === 'TRAILING' || formData.strategy === 'REVERSAL' ) && (
            <div>
              <label className="block mb-2">Pricing Gap:</label>
              <input
                type="number"
                className="retro-input w-full"
                value={formData.GAP}
                onChange={( e ) => setFormData( { ...formData, GAP: parseFloat( e.target.value ) } )}
                min="0.25"
                step="0.25"
              />
            </div>
          )}

          <div>
            <label className="block mb-2">Eclipse Buffer:</label>
            <input
              type="number"
              className="retro-input w-full"
              value={formData.ECLIPSE_BUFFER}
              onChange={( e ) => setFormData( { ...formData, ECLIPSE_BUFFER: parseFloat( e.target.value ) } )}
              min="0.01"
              step="0.01"
            />
          </div>

          <div>
            <label className="block mb-2">Volume:</label>
            <input
              type="number"
              className="retro-input w-full"
              value={formData.volume}
              onChange={( e ) => setFormData( { ...formData, volume: parseFloat( e.target.value ) } )}
              min="0.01"
              step="0.01"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t-2 border-gray-600">
            <Button
              type="button"
              onClick={onCloseDialog}
              className="retro-button"
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              className="retro-button bg-green-700 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed"
              disabled={!formData.symbol || !formData.strategy || ( ( formData.strategy === 'TRAILING' || formData.strategy === 'REVERSAL' ) && !formData.GAP ) || !formData.ECLIPSE_BUFFER || !formData.volume || ( formData.strategy === 'REVERSAL' && !formData.direction ) || isLoading}
              isLoading={isLoading}
            >
              EXECUTE
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
