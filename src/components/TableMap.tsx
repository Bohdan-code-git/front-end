import { Table } from "@/types/reservation";
import { cn } from "@/lib/utils";

interface TableMapProps {
    tables: Table[];
    selectedTableNumber: string | null;
    onSelectTable: (tableNumber: string) => void;
}

const visualTableMap = {
    "1": { capacity: 4, top: "40px", left: "120px", width: "120px", height: "120px", type: 'square' },
    "2": { capacity: 2, top: "50px", left: "260px", width: "100px", height: "100px", type: 'circle' },
    "3": { capacity: 3, top: "50px", right: "60px", width: "100px", height: "100px", type: 'circle' },
    "4": { capacity: 2, top: "180px", right: "60px", width: "80px", height: "80px", type: 'circle' },

    "7": { capacity: 8, top: "270px", left: "20px", width: "60px", height: "100px", type: 'vertical-rect' },
    "8": { capacity: 10, top: "390px", left: "20px", width: "60px", height: "100px", type: 'vertical-rect' },
    "9": { capacity: 2, top: "510px", left: "20px", width: "60px", height: "100px", type: 'vertical-rect' },

    "5": { capacity: 2, top: "300px", left: "200px", width: "100px", height: "100px", type: 'circle' },
    "6": { capacity: 4, top: "300px", right: "200px", width: "100px", height: "100px", type: 'circle' },

    "bar": { capacity: 6, bottom: "40px", left: "150px", width: "350px", height: "80px", type: 'bar' },
};


const TableShape = ({ tableNumber, capacity, reserved, selected, onClick, style, type }: any) => {

    const baseClasses = "absolute flex items-center justify-center p-2 text-center text-sm font-semibold transition-all duration-200 cursor-pointer border";

    const stateClasses = cn(
        !reserved && "bg-[#FBEFDB] border-orange-300 hover:scale-[1.03] text-stone-700",
        reserved && "bg-gray-300 border-gray-400 opacity-80 cursor-not-allowed text-gray-600",
        selected && "ring-4 ring-offset-2 ring-orange-500/80 !bg-orange-200 border-orange-600 shadow-xl",
    );

    const shapeClasses = cn(
        type === 'circle' && "rounded-full",
        type === 'square' && "rounded-md",
        type === 'vertical-rect' && "rounded-md",
        type === 'bar' && "rounded-xl border-none p-4",
    );

    return (
        <div
            className={cn(baseClasses, stateClasses, shapeClasses)}
            style={style}
            onClick={() => !reserved && onClick(tableNumber)}
        >
            <div className="flex flex-col">
                {tableNumber !== 'bar' && <span>№{tableNumber}</span>}
                {tableNumber === 'bar' && <span>bar</span>}
                <span className={cn("text-xs font-normal", tableNumber === 'bar' ? 'mt-2' : '')}>
            {capacity} persons
          </span>
            </div>
        </div>
    );
};

export const TableMap = ({ tables, selectedTableNumber, onSelectTable }: TableMapProps) => {

    const tableLookup = tables.reduce((acc, table) => {
        acc[table.number] = table;
        return acc;
    }, {} as Record<string, Table>);


    return (
        <div className="p-6 border border-gray-300 rounded-lg shadow-xl w-full bg-gray-50">
            <h2 className="text-xl font-bold mb-6">Map of Baho restaurant</h2>

            <div className="relative border border-gray-300 h-[700px] w-full max-w-[650px] mx-auto bg-white" style={{ minWidth: '550px' }}>

                <div className="absolute top-[200px] left-0 h-0.5 w-[200px] bg-gray-400"></div>
                <div className="absolute top-[200px] left-[200px] text-xs text-gray-500 -translate-x-1/2 -translate-y-5">entrance</div>

                <div className="absolute top-0 right-0 h-full w-[15px] bg-gray-100 border-l border-gray-300">
                    <div className="absolute top-[10px] right-[10px] text-xs text-gray-500 rotate-90 origin-top-right translate-x-[20px] translate-y-[-10px]">window</div>
                    <div className="absolute top-[150px] w-full h-[5px] bg-gray-400 opacity-50"></div>
                    <div className="absolute top-[400px] w-full h-[5px] bg-gray-400 opacity-50"></div>
                </div>

                {Object.entries(visualTableMap).map(([number, config]) => {

                    const tableData = tableLookup[number];

                    if (!tableData && number !== 'bar') return null;

                    const isReserved = tableData ? !tableData.isAvailable : false;
                    const tableCapacity = tableData ? tableData.capacity : config.capacity;
                    const tableNumber = tableData ? tableData.number : number;

                    return (
                        <TableShape
                            key={tableNumber}
                            tableNumber={tableNumber}
                            capacity={tableCapacity}
                            reserved={isReserved}
                            selected={selectedTableNumber === tableNumber}
                            onClick={onSelectTable}
                            style={config}
                            type={config.type}
                        />
                    );
                })}

                <div className="absolute top-[-10px] left-[-100px] p-3 bg-white border border-gray-200 rounded-md text-xs space-y-1 shadow-md">
                    <div className="font-semibold mb-1">Legend:</div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-sm bg-orange-200 border border-orange-600"></div>
                        <span>- selected table</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-sm bg-[#FBEFDB] border border-orange-300"></div>
                        <span>- available table</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-sm bg-gray-300 border border-gray-400"></div>
                        <span>- reserved table</span>
                    </div>
                </div>

            </div>
        </div>
    );
};