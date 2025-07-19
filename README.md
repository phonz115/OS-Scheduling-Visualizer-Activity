This project is a JavaScript-based CPU Scheduling Simulator designed to run entirely in the terminal/console. It allows users to explore and visualize various CPU scheduling algorithms, like FIFO, SJF, SRTF, Round Robin, and MLFQ.

Instructions:
1. You are given the chance to choose what input process arrival and burst times by yourself or let the program randomly generate arrival and burst times.
2. Enter the number of processes (numbers must be positive).
3. In this part, you need to provide data. If you choose A, you will be asked to to enter the arrival and and burst time on a process. If you choose B, the program will randomly generate arrival and burst times.

What are the scheduling process presemt?
1. FIFO (First-In, First-Out)
Type: Non-preemptive
Description: Processes are executed in the order they arrive. Once a process starts running, it finishes before the next one begins.
Limitation: Can cause long waiting times if a long process arrives first.

2. SJF (Shortest Job First)
Type: Non-preemptive
Description: Chooses the process with the shortest burst time among the ready processes.
Best For: Systems where process lengths are known in advance.
Limitation: It can cause starvation.

SRTF (Shortest Remaining Time First)
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
Features: Includes priority boosting to prevent starvation.
Limitation: Configuration-sensitive; requires careful tuning of queues, quantum, and boost time.

Is not a multi-platform operating system (Windows Command Prompt vs Linux Terminal)
Uses readline, which functions properly, but the behavior of the terminal, or reading new lines might be different based on the platform they are executed on.

CLI options were lacking (silently execute an automated operation, deny some actions, etc.).

2. Absence of I/O Blocking or Context Switching Cost Support
Processes are modeled as being CPU-bound always on.

No model is given on I/O bursts or the contention of context-switch penalty.

3. Merely Time-Based Simulation
Nothing is shown in real time or graph; it's all in a time-constrained model (not driven by a real-world delay-based simulation).

4. MLFQ Has Predetermined Queue Levels and Parameters
These cannot be modified:

-NumberOf queues

-Quantum per level

-Allotment per level,

They are hardcoded; say, quanta = [4, 8, Infinity], etc., on closer inspection.

5. No Logging to File / Exporting Output
Only results are given on the console screen.

You cannot save the Gantt Chart or metrics in a .txt file or a .csv file.

🚧 Incomplete / Missing Features
1. Not able to change the name of the Process ID or Rename them to Something Else
The name of a process is fixed to P0, P1, ... and so on.

Users cannot name or label them (LoginTask, Renderer, etc.).

2. Input Validation Lacks Non-numeric Entries
Example: If user enters a or blank space for burst time, it only checks isNaN, not whether it'
