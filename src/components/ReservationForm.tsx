import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Table } from "@/types/reservation";
import { reservationSchema, ReservationFormData } from "@/schemas/reservationSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { CalendarIcon, ClockIcon, UsersIcon } from "lucide-react";

interface ReservationFormProps {
    availableTables: Table[];
    selectedTableNumber: string | null;
    onSave: (data: ReservationFormData) => void;
    onCancel: () => void;
    isSubmitting: boolean;
    onTableSelect: (tableNumber: string) => void;
}

export const ReservationForm = ({
                                    availableTables,
                                    selectedTableNumber,
                                    onSave,
                                    onCancel,
                                    isSubmitting,
                                    onTableSelect,
                                }: ReservationFormProps) => {

    const form = useForm<ReservationFormData>({
        resolver: zodResolver(reservationSchema),
        defaultValues: {
            guestName: "",
            guestPhone: "",
            date: new Date().toISOString().split('T')[0],
            time: "16:00",
            guests: 3,
            tableNumber: "",
        },
        mode: "onChange",
    });

    useEffect(() => {
        if (selectedTableNumber) {
            form.setValue("tableNumber", selectedTableNumber, { shouldValidate: true });
        }
    }, [selectedTableNumber, form]);

    const guests = form.watch("guests");
    const filteredTables = availableTables.filter(t => t.capacity >= guests);

    const handleSubmit = (data: ReservationFormData) => {
        onSave(data);
    };

    return (
        <div className="p-6 bg-white border border-gray-300 rounded-lg shadow-xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-6">Make a reservation</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

                    <FormField
                        control={form.control}
                        name="guestName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full name</FormLabel>
                                <FormControl><Input placeholder="Full name" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>)}
                    />

                    <FormField
                        control={form.control}
                        name="guestPhone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone number</FormLabel>
                                <FormControl><Input placeholder="Phone number" type="tel" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>)}
                    />

                    <FormItem>
                        <FormLabel>Select restaurant</FormLabel>
                        <Select disabled>
                            <SelectTrigger><SelectValue placeholder="Baho restaurant" /></SelectTrigger>
                            <SelectContent><SelectItem value="baho">Baho restaurant</SelectItem></SelectContent>
                        </Select>
                    </FormItem>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select date</FormLabel>
                                    <div className="relative">
                                        <Input type="date" value={field.value.split('T')[0]} onChange={field.onChange} className="pr-10"/>
                                        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select time</FormLabel>
                                    <div className="relative">
                                        <Input type="time" value={field.value} onChange={field.onChange} className="pr-10"/>
                                        <ClockIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="guests"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Persons quantity</FormLabel>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        min="1"
                                        placeholder="3"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                        className="pr-10"
                                    />
                                    <UsersIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="tableNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select available table</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        onTableSelect(value);
                                    }}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select available table" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {filteredTables.map((table) => (
                                            <SelectItem
                                                key={table.number}
                                                value={table.number}
                                            >
                                                Table №{table.number} ({table.capacity} seats)
                                            </SelectItem>
                                        ))}
                                        {filteredTables.length === 0 && (
                                            <div className="p-2 text-center text-sm text-muted-foreground">
                                                No tables available for {guests} persons.
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="flex-1 rounded-lg border-gray-300 text-gray-700 font-semibold"
                            style={{borderColor: '#D4D4D4', backgroundColor: '#FFFFFF'}}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !form.formState.isValid}
                            className="flex-1 rounded-lg text-gray-800 font-semibold"
                            style={{backgroundColor: '#FBEFDB', color: '#333333'}}
                        >
                            {isSubmitting ? "Confirming..." : "Confirm"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};