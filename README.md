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

Sample input and expected output:
Scheduling Visualizer

A. Manual Input
B. Random Process
Enter your letter of choice (A OR B): A
Enter the number of processes: 5

Enter arrival time for P0: 0
Enter burst time for P0: 4

Enter arrival time for P1: 2
Enter burst time for P1: 2

Enter arrival time for P2: 4
Enter burst time for P2: 1

Enter arrival time for P3: 5
Enter burst time for P3: 3

Enter arrival time for P4: 6
Enter burst time for P4: 2

Choose a Scheduling Algorithm:
1. FIFO
2. SJF
3. SRTF
4. Round Robin
5. MLFQ
6. Priority
Enter your choice (1-6): 4
Enter time slice: 2

Gantt Chart:
P0 [0-2] -> P1 [2-4] -> P0 [4-6] -> P2 [6-7] -> P3 [7-9] -> P4 [9-11] -> P3 [11-12]

Process Metrics:
PID     Arrival Burst   Finish  TAT     Response
P0      0       4       6       6       0
P1      2       2       4       2       0
P2      4       1       7       3       2
P3      5       3       12      7       2
P4      6       2       11      5       3

Average Turnaround Time: 4.6  
Average Response Time: 1.4


