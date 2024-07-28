import { Pie } from "react-chartjs-2";

const options: any = {
    responsive: true,
    plugins: {
        legend: {
            position: "bottom",
        },
        title: {
            display: true,
            text: "Pie Chart Example",
        },
    },
};

export default function PieChart({labels,data}:{labels:any,data:any}) {
    return (
        <>
            <Pie options={options} data={{
                labels: labels,
                datasets: [{
                    data,
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)'
                    ],
                    hoverOffset: 4
                }]
            }}/>
        </>
    )
}

