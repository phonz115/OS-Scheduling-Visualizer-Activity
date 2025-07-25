const readline = require('readline');

class Process {
    constructor(id, arrivalTime, burstTime) {
        this.id = id;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
        this.completionTime = 0;
        this.turnaroundTime = 0;
        this.responseTime = -1;
        this.priorityLevel = 0;
        this.timeInQueue = 0;
    }
}

class SchedulerVisualizer {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.processes = [];
    }

    async main() {
        console.log("Scheduling Visualizer\n");
        console.log("A. Manual Input");
        console.log("B. Random Process");
        const inputType = await this.question("Enter your letter of choice (A OR B): ");

        let n;
        while (true) {
            n = parseInt(await this.question("Enter the number of processes: "));
            if (isNaN(n) || n <= 0) {
                console.log("Please enter a positive number for the number of processes.");
            } else {
                break;
            }
        }

        if (inputType.toUpperCase() === 'A') {
            await this.manualInput(n);
        } else {
            await this.randomInput(n);
        }

        console.log("\nChoose a Scheduling Algorithm:");
        console.log("1. FIFO");
        console.log("2. SJF");
        console.log("3. SRTF");
        console.log("4. Round Robin");
        console.log("5. MLFQ");
        const choice = await this.question("Enter your choice (1-5): ");

        switch (choice) {
            case '1':
                await this.runScheduler(new FIFOScheduler(this.processes));
                break;
            case '2':
                await this.runScheduler(new SJFScheduler(this.processes));
                break;
            case '3':
                await this.runScheduler(new SRTFScheduler(this.processes));
                break;
            case '4':
                let timeSlice;
                while (true) {
                    timeSlice = parseInt(await this.question("Enter time slice: "));
                    if (isNaN(timeSlice) || timeSlice <= 0) {
                        console.log("Time slice must be a positive number.");
                    } else {
                        break;
                    }
                }
                await this.runScheduler(new RoundRobinScheduler(this.processes, timeSlice));
                break;
            case '5':
                let boostTime;
                while (true) {
                    boostTime = parseInt(await this.question("Enter boost time (e.g. 20): "));
                    if (isNaN(boostTime) || boostTime <= 0) {
                        console.log("Boost time must be a positive number.");
                    } else {
                        break;
                    }
                }
                await this.runScheduler(new MLFQScheduler(this.processes, boostTime));
                break;
            default:
                console.log("Invalid choice. Please try again!");
        }

        this.rl.close();
    }

    async question(prompt) {
        return new Promise(resolve => this.rl.question(prompt, resolve));
    }

    async manualInput(n) {
        this.processes = [];
        for (let i = 0; i < n; i++) {
            let arrival, burst;
            while (true) {
                arrival = parseInt(await this.question(`Enter arrival time for P${i}: `));
                if (isNaN(arrival) || arrival < 0) {
                    console.log("Arrival time must be a non-negative number.");
                } else {
                    break;
                }
            }
            while (true) {
                burst = parseInt(await this.question(`Enter burst time for P${i}: `));
                if (isNaN(burst) || burst <= 0) {
                    console.log("Burst time must be a positive number.");
                } else {
                    break;
                }
            }
            this.processes.push(new Process(i, arrival, burst));
        }
    }

    async randomInput(n) {
        this.processes = [];
        for (let i = 0; i < n; i++) {
            const arrival = Math.floor(Math.random() * 10);
            const burst = Math.floor(Math.random() * 10) + 1;
            console.log(`P${i} - Arrival: ${arrival}, Burst: ${burst}`);
            this.processes.push(new Process(i, arrival, burst));
        }
    }

    async runScheduler(scheduler) {
        const result = scheduler.schedule();
        const ganttChart = result.ganttChart;

        console.log("\nGantt Chart (Animating):");
        await this.renderGanttChart(ganttChart);
        this.printMetrics(result.processes);
    }

    async renderGanttChart(ganttChart) {
        for (const entry of ganttChart) {
            console.log(`P${entry.process} [${entry.start}-${entry.end}]`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    printMetrics(processes) {
        console.log("\nProcess Metrics:");
        console.log("PID\tArrival\tBurst\tFinish\tTAT\tResponse");

        processes.forEach(p => {
            console.log(`P${p.id}\t${p.arrivalTime}\t${p.burstTime}\t${p.completionTime}\t${p.turnaroundTime}\t${p.responseTime}`);
        });

        const avgTAT = processes.reduce((sum, p) => sum + p.turnaroundTime, 0) / processes.length;
        const avgRT = processes.reduce((sum, p) => sum + p.responseTime, 0) / processes.length;

        console.log(`\nAverage Turnaround Time: ${avgTAT.toFixed(2)}`);
        console.log(`Average Response Time: ${avgRT.toFixed(2)}`);
    }


generateRandomProcesses(count) {
    const tableBody = document.getElementById('process-table');
    
    for (let i = 0; i < count; i++) {
        const arrival = Math.floor(Math.random() * 10);
        const burst = Math.floor(Math.random() * 10) + 1;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>P${i}</td>
            <td>${arrival}</td>
            <td>${burst}</td>
        `;
        tableBody.appendChild(row);
        
        const process = new Process(i, arrival, burst);
        this.processes.push(process);
    }
    
    document.getElementById('action-message').textContent = `Generated ${count} random processes`;
}
prepareManualInputTable(count) {
    const tableBody = document.getElementById('process-table');
    
    for (let i = 0; i < count; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>P${i}</td>
            <td><input type="number" min="0" class="arrival-time" value="0"></td>
            <td><input type="number" min="1" class="burst-time" value="1"></td>
        `;
        tableBody.appendChild(row);
    }
    
    document.getElementById('action-message').textContent = `Please enter process details for ${count} processes`;
}

collectManualInputData() {
    const rows = document.getElementById('process-table').rows;
    this.processes = [];
    
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].cells;
        const arrival = parseInt(cells[2].querySelector('input').value);
        const burst = parseInt(cells[3].querySelector('input').value);
        
        if (isNaN(arrival) || isNaN(burst) || burst <= 0) {
            document.getElementById('action-message').textContent = `Invalid input for process P${i}`;
            return;
        }
        
        const process = new Process(i, arrival, burst);
        this.processes.push(process);
    }
}

}

class FIFOScheduler {
    constructor(processes) {
        this.processes = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    }
    
    schedule() {
        let currentTime = 0;
        const ganttChart = [];
        
        for (const process of this.processes) {
            if (currentTime < process.arrivalTime) {
                currentTime = process.arrivalTime;
            }
            
            if (process.responseTime === -1) {
                process.responseTime = currentTime - process.arrivalTime;
            }
            
            ganttChart.push({
                process: process.id,
                start: currentTime,
                end: currentTime + process.burstTime
            });
            
            currentTime += process.burstTime;
            process.completionTime = currentTime;
            process.turnaroundTime = process.completionTime - process.arrivalTime;
        }
        
        return { ganttChart, processes: this.processes };
    }
}

class SJFScheduler {
    constructor(processes) {
        this.processes = processes.map(p => ({
            ...p,
            remainingTime: p.burstTime,
            responseTime: -1,
            completionTime: 0,
            turnaroundTime: 0
        }));
    }
    
    schedule() {
        let currentTime = 0;
        const ganttChart = [];
        const completed = [];
        const readyQueue = [];
        
        while (completed.length < this.processes.length) {
            this.processes.forEach(p => {
                if (p.arrivalTime <= currentTime && !completed.includes(p) && !readyQueue.includes(p)) {
                    readyQueue.push(p);
                }
            });
            
            if (readyQueue.length === 0) {
                currentTime++;
                continue;
            }
            
            readyQueue.sort((a, b) => a.burstTime - b.burstTime);
            const process = readyQueue.shift();
            
            if (process.responseTime === -1) {
                process.responseTime = currentTime - process.arrivalTime;
            }
            
            ganttChart.push({
                process: process.id,
                start: currentTime,
                end: currentTime + process.burstTime
            });
            
            currentTime += process.burstTime;
            process.completionTime = currentTime;
            process.turnaroundTime = process.completionTime - process.arrivalTime;
            completed.push(process);
        }
        
        return { ganttChart, processes: this.processes };
    }
}

class SRTFScheduler {
    constructor(processes) {
        this.processes = processes.map(p => ({
            ...p,
            remainingTime: p.burstTime,
            responseTime: -1,
            completionTime: 0,
            turnaroundTime: 0
        }));
    }

    schedule() {
        let currentTime = 0;
        const ganttChart = [];
        const completed = [];
        let lastProcessId = null;

        while (completed.length < this.processes.length) {
            const readyQueue = this.processes.filter(p =>
                p.arrivalTime <= currentTime &&
                p.remainingTime > 0 &&
                !completed.includes(p)
            );

            if (readyQueue.length === 0) {
                currentTime++;
                continue;
            }

            readyQueue.sort((a, b) => a.remainingTime - b.remainingTime);
            const process = readyQueue[0];

            if (process.responseTime === -1) {
                process.responseTime = currentTime - process.arrivalTime;
            }

            if (
                ganttChart.length > 0 &&
                ganttChart[ganttChart.length - 1].process === process.id
            ) {
                ganttChart[ganttChart.length - 1].end = currentTime + 1;
            } else {
                ganttChart.push({
                    process: process.id,
                    start: currentTime,
                    end: currentTime + 1
                });
            }

            process.remainingTime--;
            currentTime++;
            lastProcessId = process.id;

            if (process.remainingTime === 0) {
                process.completionTime = currentTime;
                process.turnaroundTime = process.completionTime - process.arrivalTime;
                completed.push(process);
            }
        }

        return { ganttChart, processes: this.processes };
    }
}

class RoundRobinScheduler {
    constructor(processes, timeSlice) {
        this.processes = processes.map(p => ({
            ...p,
            remainingTime: p.burstTime,
            responseTime: -1,
            completionTime: 0,
            turnaroundTime: 0
        }));
        this.timeSlice = timeSlice;
    }

    schedule() {
        let currentTime = 0;
        const ganttChart = [];
        const queue = [];
        const completed = [];
        let arrived = [];

        while (completed.length < this.processes.length) {
            this.processes.forEach(p => {
                if (p.arrivalTime <= currentTime && !arrived.includes(p)) {
                    queue.push(p);
                    arrived.push(p);
                }
            });

            if (queue.length === 0) {
                currentTime++;
                continue;
            }

            const process = queue.shift();

            if (process.responseTime === -1) {
                process.responseTime = currentTime - process.arrivalTime;
            }

            const execTime = Math.min(this.timeSlice, process.remainingTime);

            if (
                ganttChart.length > 0 &&
                ganttChart[ganttChart.length - 1].process === process.id &&
                ganttChart[ganttChart.length - 1].end === currentTime
            ) {
                ganttChart[ganttChart.length - 1].end = currentTime + execTime;
            } else {
                ganttChart.push({
                    process: process.id,
                    start: currentTime,
                    end: currentTime + execTime
                });
            }

            process.remainingTime -= execTime;
            currentTime += execTime;

            this.processes.forEach(p => {
                if (p.arrivalTime > (currentTime - execTime) && p.arrivalTime <= currentTime && !arrived.includes(p)) {
                    queue.push(p);
                    arrived.push(p);
                }
            });

            if (process.remainingTime === 0) {
                process.completionTime = currentTime;
                process.turnaroundTime = process.completionTime - process.arrivalTime;
                completed.push(process);
            } else {
                queue.push(process);
            }
        }

        return { ganttChart, processes: this.processes };
    }
}

class MLFQScheduler {
    constructor(processes, boostTime = 20, quanta = [4, 8, 16, Infinity], allotments = [8, 16, 32, Infinity]) {
        this.queues = [
            { quantum: quanta[0], processes: [] },
            { quantum: quanta[1], processes: [] },
            { quantum: quanta[2], processes: [] },
            { quantum: quanta[3], processes: [] }
        ];
        this.allotments = allotments; 
        this.processes = processes.map(p => ({
            ...p,
            remainingTime: p.burstTime,
            queueLevel: 0,
            responseTime: -1,
            completionTime: 0,
            turnaroundTime: 0,
            timeInQueue: 0 
        }));
        this.completed = [];
        this.boostTime = boostTime;
        this.lastBoost = 0;
    }

    schedule() {
        let currentTime = 0;
        const ganttChart = [];
        let arrived = [];

        while (this.completed.length < this.processes.length) {
            if (currentTime - this.lastBoost >= this.boostTime && currentTime !== 0) {
                for (let i = 1; i < this.queues.length; i++) {
                    while (this.queues[i].processes.length > 0) {
                        const proc = this.queues[i].processes.shift();
                        proc.queueLevel = 0;
                        proc.timeInQueue = 0; 
                        this.queues[0].processes.push(proc);
                    }
                }
                this.lastBoost = currentTime;
            }

            this.processes.forEach(p => {
                if (p.arrivalTime <= currentTime && !arrived.includes(p) && p.remainingTime > 0) {
                    this.queues[0].processes.push(p);
                    arrived.push(p);
                }
            });

            let queueIdx = this.queues.findIndex(q => q.processes.length > 0);
            if (queueIdx === -1) {
                currentTime++;
                continue;
            }
            let queue = this.queues[queueIdx];
            let process = queue.processes.shift();

            if (process.responseTime === -1) {
                process.responseTime = currentTime - process.arrivalTime;
            }

            let allotLeft = this.allotments[queueIdx] - process.timeInQueue;
            let execTime = Math.min(queue.quantum, process.remainingTime, allotLeft);

            if (
                ganttChart.length > 0 &&
                ganttChart[ganttChart.length - 1].process === process.id &&
                ganttChart[ganttChart.length - 1].end === currentTime &&
                ganttChart[ganttChart.length - 1].queue === queueIdx
            ) {
                ganttChart[ganttChart.length - 1].end = currentTime + execTime;
            } else {
                ganttChart.push({
                    process: process.id,
                    start: currentTime,
                    end: currentTime + execTime,
                    queue: queueIdx
                });
            }

            process.remainingTime -= execTime;
            process.timeInQueue += execTime;
            currentTime += execTime;

            this.processes.forEach(p => {
                if (
                    p.arrivalTime > (currentTime - execTime) &&
                    p.arrivalTime <= currentTime &&
                    !arrived.includes(p) &&
                    p.remainingTime > 0
                ) {
                    this.queues[0].processes.push(p);
                    arrived.push(p);
                }
            });

            if (process.remainingTime === 0) {
                process.completionTime = currentTime;
                process.turnaroundTime = process.completionTime - process.arrivalTime;
                this.completed.push(process);
            } else {
                if (process.timeInQueue >= this.allotments[queueIdx] && queueIdx < this.queues.length - 1) {
                    process.queueLevel = queueIdx + 1;
                    process.timeInQueue = 0; 
                    this.queues[queueIdx + 1].processes.push(process);
                } else {
                    this.queues[queueIdx].processes.push(process);
                }
            }
        }

        return { ganttChart, processes: this.processes };
    }
}

const visualizer = new SchedulerVisualizer();
visualizer.main().catch(err => console.error(err));
