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

        const n = parseInt(await this.question("Enter the number of processes: "));

        if (inputType === '1') {
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

        switch(choice) {
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
                const timeSlice = parseInt(await this.question("Enter time slice: "));
                await this.runScheduler(new RoundRobinScheduler(this.processes, timeSlice));
                break;
            case '5':
                await this.runScheduler(new MLFQScheduler(this.processes));
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
            const arrival = parseInt(await this.question(`Enter arrival time for P${i}: `));
            const burst = parseInt(await this.question(`Enter burst time for P${i}: `));
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
        console.log("\nGantt Chart:");
        console.log(result.ganttChart.map(entry => 
            `P${entry.process} [${entry.start}-${entry.end}]`).join(" -> "));
        
        console.log("\nProcess Metrics:");
        console.log("PID\tArrival\tBurst\tFinish\tTAT\tResponse");
        result.processes.forEach(p => {
            console.log(`P${p.id}\t${p.arrivalTime}\t${p.burstTime}\t${p.completionTime}\t${p.turnaroundTime}\t${p.responseTime}`);
        });
        
        const avgTAT = result.processes.reduce((sum, p) => sum + p.turnaroundTime, 0) / result.processes.length;
        const avgRT = result.processes.reduce((sum, p) => sum + p.responseTime, 0) / result.processes.length;
        console.log(`\nAverage Turnaround Time: ${avgTAT.toFixed(2)}`);
        console.log(`Average Response Time: ${avgRT.toFixed(2)}`);
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

            if (lastProcessId !== process.id) {
                ganttChart.push({
                    process: process.id,
                    start: currentTime,
                    end: currentTime + 1
                });
            } else {
                ganttChart[ganttChart.length - 1].end = currentTime + 1;
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

            ganttChart.push({
                process: process.id,
                start: currentTime,
                end: currentTime + execTime
            });

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


const visualizer = new SchedulerVisualizer();
visualizer.main().catch(err => console.error(err));