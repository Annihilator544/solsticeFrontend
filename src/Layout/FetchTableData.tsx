import { PaymentInfo } from "@/components/table/columns";
import { useTableData } from "@/store/use-table-data";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

function FetchTableData({children}: {children: React.ReactNode}) {
    const { tableData, setTableData } = useTableData();
    const fetchAllBankEmails = useCallback(async () => {
        try {
          const response = await fetch('http://127.0.0.1:5000/fetch_all_bank_emails');
          const data: PaymentInfo[] = await response.json();
    
          // Filter out items that already exist in tableData
          const newItems = data.filter(
            (item) => !tableData.some((existing) => existing.upi_reference === item.upi_reference)
          );
    
          // Update state only if there's new data
          if (newItems.length > 0) {
            setTableData([...tableData, ...newItems] as PaymentInfo[]);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
        }
      }, [tableData, setTableData]);

      const fetchNewBankEmails = useCallback(async () => {
        try {
          const response = await fetch('http://127.0.0.1:5000/fetch_new_bank_emails');
          const data: PaymentInfo[] = await response.json();
    
          // Filter out items that already exist in tableData
          const newItems = data.filter(
            (item) => !tableData.some((existing) => existing.upi_reference === item.upi_reference)
          );
    
          // Update state only if there's new data
          if (newItems.length > 0) {
            setTableData([...tableData, ...newItems] as PaymentInfo[]);
            toast.success('New data loaded successfully!');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
        }
      }, [tableData, setTableData]);
      useEffect(() => {
        // Immediately fetch once on mount
        const fetchPromise = fetchAllBankEmails();
        toast.promise(fetchPromise, {
          loading: 'Loading data...',
          success: 'Data loaded successfully!',
          error: 'Error loading data.',
        });
    
        // Set up a polling interval
        const intervalId = setInterval(() => {
          fetchNewBankEmails().catch(() => {
            // You can catch errors here if you want
          });
        }, 10000); // fetch every 5 seconds (adjust as needed)
    
        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
      }, [fetchNewBankEmails, fetchAllBankEmails]);
      //function to call api periodically
  return (
    <div>
      {children}
    </div>
  );
}

export default FetchTableData;