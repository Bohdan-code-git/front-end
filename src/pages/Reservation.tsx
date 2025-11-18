import { useState } from 'react';
import { ReservationForm } from '@/components/ReservationForm';
import { TableMap } from '@/components/TableMap';
import { ReservationFormData } from '@/schemas/reservationSchema';
import { useTables } from '@/hooks/useTables';
import { useCreateReservation } from '@/hooks/useCreateReservation';
import { useToast } from '@/hooks/use-toast';

const ReservationPage = () => {
    const [selectedTableNumber, setSelectedTableNumber] = useState<string | null>(null);
    const { toast } = useToast();

    const { data: tables = [], isLoading: tablesLoading } = useTables();

    const createReservationMutation = useCreateReservation();
    const isSubmitting = createReservationMutation.isPending;

    const availableTables = tables.filter(t => t.isAvailable);

    const handleCreateReservation = (data: ReservationFormData) => {

        createReservationMutation.mutate(data, {
            onSuccess: () => {
                toast({ title: "Reservation successful!", description: `Table №${data.tableNumber} has been booked.` });
                setSelectedTableNumber(null);
            },
            onError: () => {
                toast({ title: "Reservation error", description: "Failed to create reservation. Please try again.", variant: "destructive" });
            },
        });
    };

    const handleCancel = () => {
        setSelectedTableNumber(null);
    };

    if (tablesLoading) {
        return <div className="container mx-auto py-10 text-center text-lg text-muted-foreground">Loading tables map...</div>;
    }

    return (
        <div className="container mx-auto py-10 px-4">

            <div className="flex flex-col lg:flex-row gap-8">

                <div className="w-full lg:w-2/5">
                    <ReservationForm
                        availableTables={availableTables}
                        selectedTableNumber={selectedTableNumber}
                        onTableSelect={setSelectedTableNumber}
                        onSave={handleCreateReservation}
                        onCancel={handleCancel}
                        isSubmitting={isSubmitting}
                    />
                </div>

                <div className="w-full lg:w-3/5">
                    <TableMap
                        tables={tables}
                        selectedTableNumber={selectedTableNumber}
                        onSelectTable={setSelectedTableNumber}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReservationPage;