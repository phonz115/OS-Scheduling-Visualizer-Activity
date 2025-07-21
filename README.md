This project is a JavaScript-based CPU Scheduling Simulator designed to run entirely in the terminal/console. It allows users to explore and visualize various CPU scheduling algorithms, like FIFO, SJF, SRTF, Round Robin, and MLFQ.


Instructions:
1. You are given the chance to choose what input process arrival and burst times by yourself or let the program randomly generate arrival and burst times.
2. Enter the number of processes (numbers must be positive).
3. In this part, you need to provide data. If you choose A, you will be asked to to enter the arrival and and burst time on a process. If you choose B, the program will randomly generate arrival and burst times.

What are the scheduling process present?
1. FIFO (First-In, First-Out)
Type: Non-preemptive
Description: Processes are executed in the order they arrive. Once a process starts running, it finishes before the next one begins.
Limitation: Can cause long waiting times if a long process arrives first.

2. SJF (Shortest Job First)
Type: Non-preemptive
Description: Chooses the process with the shortest burst time among the ready processes.
Best For: Systems where process lengths are known in advance.
Limitation: It can cause starvation.

3. SRTF (Shortest Remaining Time First)
Type: Preemptive
Description: A variation of SJF where the CPU is given to the process with the shortest remaining burst time. It can preempt the currently running process if a shorter one arrives.
Best For: Systems needing fast turnaround for short jobs.
Limitation: High overhead from frequent context switches.

4. Round Robin (RR)
Type: Preemptive
Description: Each process gets a fixed time slice (quantum) to execute. If it doesn't finish, it's moved to the back of the queue.
Limitation: Too small a time slice causes overhead; too large reverts to FIFO.

5. MLFQ (Multilevel Feedback Queue)
Type: Preemptive with dynamic priority
Description: Uses multiple queues with different priority levels and time quanta. Processes start in the highest priority queue and get demoted if they use up their time slice.
Limitation: Configuration-sensitive; requires careful tuning of queues, quantum, and boost time.


Known bugs, limitations or incomplete features:
1. Mixing of CLI and DOM-based Code
The methods generateRandomProcesses(), prepareManualInputTable(), and collectManualInputData() are designed for a web-based HTML interface, not for a Node.js CLI terminal.

   2.  Incorrect Response Time Tracking in SRTF / RR / MLFQ
responseTime is only set when a process is first picked, not when it first runs. This is fine for most cases, but:

    Process Arrival Not Rechecked Thoroughly
In Round Robin and MLFQ, process arrivals are checked only after each execution, not continuously per time unit.

4. MLFQ Gantt Chart Inconsistency
The ganttChart output contains queue information in some places (for MLFQ), but the base renderGanttChart() method in SchedulerVisualizer only expects process, start, end.

5.  Missing Edge Case Handling
No handling of:
Processes with same arrival and burst time.
Large burst times in RR or MLFQ which can break the quantum system.
No processes at all (e.g., n = 0 case, though mostly handled).


 Limitations / Incomplete Features
1.  No GUI / Web UI Support
Some methods hint at DOM interaction (e.g., generateRandomProcesses), but the rest of the system runs in CLI.

2. No Animation / Timeline Visuals
Gantt chart is printed textually:

3. No Wait Time or CPU Utilization Calculation
Metrics shown: Arrival, Burst, Completion, TAT, RT

Missing:
Waiting Time (WT): = Turnaround - Burst
CPU Utilization

4. No Restart / Retry / Menu Loop

5. No Test or Debug Mode
Lacks logging of internal state (queue contents, demotions, boosts, etc.).


Sample input and expected output:

![FIFO vis](https://github.com/user-attachments/assets/48bf888e-c363-4977-8a28-2ffca332a737)

![srtf](https://github.com/user-attachments/assets/ded66283-240c-4b65-8219-332c5f748edf)

![sjf](https://github.com/user-attachments/assets/1e8a938b-e9b9-4b27-ad35-efa929ba6df2)

![round robin](https://github.com/user-attachments/assets/6a803f6d-b314-415f-8fcf-2049206062d1)



