import { PaymentInfo } from "@/components/table/columns";
import { useTableData } from "@/store/use-table-data";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand,  } from "@aws-sdk/lib-dynamodb";
import { useCategoryData } from "@/store/use-category-data";

function FetchTableData({children}: {children: React.ReactNode}) {
    const { tableData, setTableData } = useTableData();
    const { changed, categoryData, setChanged } = useCategoryData();
    const fetchAllBankEmails = useCallback(async () => {
        try {
          const response = await fetch('http://127.0.0.1:5000/fetch_all_bank_emails',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // Include category config in the body
            body: JSON.stringify({ config: categoryData }),
          });
          const data: PaymentInfo[] = await response.json();
          
          // Update state only if there's new data
            setTableData(data as PaymentInfo[]);
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
            setTableData([...newItems,...tableData] as PaymentInfo[]);
            const region = "eu-west-2";
            const accessKeyId = import.meta.env.VITE_APP_DYNAMO_DB_AWS_ACCESS_KEY_ID;
            const secretAccessKey = import.meta.env.VITE_APP_DYNAMO_DB_AWS_SECRET_ACCESS_KEY;

            if (!accessKeyId || !secretAccessKey) {
              throw new Error("AWS credentials are not defined in the environment variables.");
            }

            const credentials = { accessKeyId, secretAccessKey };
            const ddbClient = new DynamoDBClient({ region, credentials });
            const docClient = DynamoDBDocumentClient.from(ddbClient);
            const tableName = "solstice";
            const params = {
              TableName: tableName,
              Item: {
                uid: "user123",
                data: tableData,
              },
            };
            await docClient.send(new PutCommand(params));
            toast.success('New data loaded successfully!');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
        }
      }, [tableData, setTableData]);
      useEffect(() => {
        // Immediately fetch once on mount
        if (tableData.length === 0) {
            const fetchPromise = fetchAllBankEmails();
            toast.promise(fetchPromise, {
            loading: 'Loading data...',
            success: 'Data loaded successfully!',
            error: 'Error loading data.',
            });
        }
        // Set up a polling interval 
        const intervalId = setInterval(() => {
          fetchNewBankEmails().catch(() => {
            // You can catch errors here if you want
          });
        }, 10000); // fetch every 5 seconds (adjust as needed)
    
        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
      }, [fetchNewBankEmails, fetchAllBankEmails]);

      useEffect(() => {
        if (changed) {
          const fetchPromise = fetchAllBankEmails();
          toast.promise(fetchPromise, {
            loading: 'Loading data...',
            success: 'Data loaded successfully!',
            error: 'Error loading data.',
          });
          setChanged(false); // Reset changed state after fetching
        }
      }, [changed, fetchAllBankEmails]);

      //function to call api periodically
  return (
    <div>
      {children}
    </div>
  );
}

export default FetchTableData;