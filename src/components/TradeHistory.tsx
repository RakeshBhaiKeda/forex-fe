import { useState, useEffect } from 'react';
import { Trade, TradeHistoryTypes } from '../types';
import { axiosInstance } from '../api/base';

interface TradeHistoryProps {
    trade: Trade;
    closePopup: () => void;
    symbol?: string;
}

export default function TradeHistory ( { trade, closePopup, symbol }: TradeHistoryProps ) {
    // State to hold trade details (if needed)
    const [ tradeHistory, setTradeHistory ] = useState<TradeHistoryTypes[] | null>( null );

    useEffect( () => {
        const fetchTradeDetails = async () => {
            try {
                const response = await axiosInstance.get( `/trade/${ trade._id }` );
                console.log( 'Trade details:', response.data.payload );
                setTradeHistory( Array.isArray( response.data.payload ) ? response.data.payload : [] );
            } catch ( error ) {
                console.error( 'Error fetching trade details:', error );
            }
        };

        fetchTradeDetails();
    }, [ trade ] );

    return (
        <div>
            <div className="flex items-center justify-between mb-4 border-b-2 border-gray-600">
                <h3 className="text-xl font-bold mb-4">TRADE HISTORY - {symbol}</h3>
                <button
                    className="retro-button mb-4"
                    onClick={closePopup}
                >
                    Close
                </button>
            </div>

            {/* Add a fixed height and enable scrolling */}
            <div className="overflow-y-auto max-h-96">
                <table className="w-full">
                    <thead className="sticky top-0 bg-gray-800 z-20">
                        <tr className="text-left border-b-2 border-gray-600">
                            <th className="py-2">STEP</th>
                            <th className="py-2">PRICE</th>
                            <th className="py-2">ACTION</th>
                            <th className="py-2">DIRECTION</th>
                            <th className="py-2">CHECKPOINT</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                        {tradeHistory?.map( ( step, index ) => (
                            <tr key={index} className="hover:bg-gray-600 cursor-pointer">
                                <td className="py-2">{index + 1}</td>
                                <td className="py-2">{step.price}</td>
                                <td className="py-2">
                                    {step.action === 'BUY' ? (
                                        <span className="text-green-500 font-semibold">
                                            📈 BUY at <i><strong>${step.price}</strong></i>
                                        </span>
                                    ) : step.action === 'SELL' ? (
                                        <span className="text-red-500 font-semibold">
                                            📉 SELL at <i><strong>${step.price}</strong></i>
                                        </span>
                                    ) : step.action === 'SKIP' ? (
                                        <span className="text-yellow-500 font-semibold">
                                            <i><strong>SKIP</strong></i> at <i><strong>${step.price}</strong></i>
                                        </span>
                                    ) : (
                                        <span className="text-gray-500 font-semibold">{step.action}</span>
                                    )}
                                </td>
                                <td className="py-2">{step.direction}</td>
                                <td className="py-2">{step.checkpoint}</td>
                            </tr>
                        ) )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
