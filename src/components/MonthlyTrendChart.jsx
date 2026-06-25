import { ResponsiveContainer,Line,LineChart,XAxis,YAxis,CartesianGrid,Tooltip, } from "recharts"
const MonthlyTrend=({data})=>{
    
   return(
     <div style={{width:"100%",height:300}}>
        <ResponsiveContainer>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="date"/>
                <YAxis/>
                <Tooltip/>
                <Line
                type="linear"
                dataKey="amount"/>
            </LineChart>
        </ResponsiveContainer>

    </div>

   )

}

export default MonthlyTrend