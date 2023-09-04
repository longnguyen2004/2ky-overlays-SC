<script lang="ts">
    import {
        Chart as ChartJS,
        LinearScale,
        CategoryScale,
        PointElement,
        LineElement,
    } from "chart.js";
    import { Line } from "svelte-chartjs";

    ChartJS.register(LinearScale, CategoryScale, PointElement, LineElement);
    export let npsArr: number[];
</script>

<div>
    <Line
        data={{
            labels: Array(npsArr.length).fill(""),
            datasets: [
                {
                    backgroundColor: "white",
                    borderColor: "white",
                    pointRadius: 0,
                    data: npsArr,
                    tension: 0.5,
                },
            ],
        }}
        options={{
            maintainAspectRatio: false,
            animation: false,
            scales: {
                x: {
                    grid: {
                        display: false,
                    },
                    display: false
                },
                y: {
                    min: 0,
                    ticks: {
                        color: "gray",
                        precision: 0
                    },
                    grid: {
                        color: "gray"
                    },
                    suggestedMax: 5
                },
            },
        }}
    />
</div>

<style>
    div {
        width: 100%;
        aspect-ratio: 2;
        background-color: #1a1a1a;
        border: solid 2px gray;
    }
</style>
