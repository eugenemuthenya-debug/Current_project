import { PieChart,Pie,Cell,Tooltip,Legend,ResponsiveContainer } from "recharts";
// Piechart-->this is our entire graph with the data
// Pie-->This are the individuals pieces of data in the piechart
// Legend-->labels tht describe the data types either below or besides the grph
// Responsive container-->chart becomes fluid and adapts to different screen sizes
// Cell-->
// Tooltip-->
const CategoryPieChart=({data}) =>{
    const colors=[
        "#4ade80",
        "#60a5fa",
        "#f59e0b",
        "#f87171",
        "#a78bfa",
        "#14b8a6"
    ]
    // this converts our array data to something redable to rechart
    const chartData=data.map(([category,amount])=>
    ({
        name:category,
        value:amount
    }))
    // console.log("Chart dat",chartData)

    return(
        <div style={{width:"100%",height:300}}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                    data = {chartData}
                        dataKey ="value"
                        nameKey="name"
                        outerRadius={100}
                        label>
                            {chartData.map((entry,index)=>(
                                <Cell
                                key={index}
                                fill={colors[index % colors.length]}/>
                            ))}

                    </Pie>
                     
                        
                        <Tooltip/>
                        <Legend/>
                </PieChart>
            </ResponsiveContainer>

        </div>
        
    )
}

export default CategoryPieChart