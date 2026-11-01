import StudyData from "./models/StudyData.js";

export const syllabus = {
  "Fundamentals of IT": [
    "Computer block diagram and functional units","CPU, memory, input/output and secondary storage","Scanners, digitizers and plotters","Hardware, software and types of computers","Number systems: binary, octal, hexadecimal and conversions","BCD, EBCDIC and ASCII","Binary arithmetic","Boolean algebra and De Morgan's laws","Logic gates and truth tables","Flip-flops, registers and accumulators","8086/8088, 80286, 80386 and Pentium processors","Programming, algorithms and flowcharts","System software, application software and firmware","Programming languages and stored-program concept","MS Office","Process scheduling: FCFS, Round Robin and Priority","Memory management: segmentation, paging and virtual memory","I/O management, FAT, interrupts and DMA","File organization: indexed, line sequential and hashed","Sorting, merging, indexing and updating","Instruction cycle and addressing modes","MS-DOS, UNIX and Windows","LAN, OSI model and network topologies","Protocols, Ethernet, ARCNET and TCP/IP","Computer viruses and antivirus","DTP, email and Internet"
  ],
  "C Programming": [
    "C fundamentals and program structure","Data types, constants and type qualifiers","Operators and expressions","Preprocessor directives","Input and output functions","if, switch and conditional statements","Loops: for, while and do-while","Storage classes and scope","Arrays and strings","Functions and recursion","Call by value and call by reference","Pointers and pointer arithmetic","Pointers and arrays","Command-line arguments","Structures and unions","File handling and file I/O","Dynamic memory: malloc and free","Bitwise operators","Library functions: atoi, atof, toupper and others"
  ],
  "Visual Basic 6.0": [
    "VB6 IDE and development environment","Variables and data types","Control flow and loops","Arrays","Procedures and functions","Controls, properties, methods and events","Menus and form design","Data validation","Debugging and error handling","Database connectivity","OLE DB and ADO","SQL integration","Crystal Reports"
  ],
  "Java": [
    "Java basics, JDK and JVM","Garbage collection","Data types, expressions and control structures","Arrays","Object-oriented programming concepts","Encapsulation, overloading and overriding","Constructors and inheritance","Dynamic method dispatch","Access modifiers","Abstract classes and interfaces","Inner and wrapper classes","Packages and exception handling","Multithreading and thread life cycle","AWT and layout managers","Event handling model","Applets","Utility classes","Streams and file I/O","Serialization"
  ],
  "DBMS": [
    "DBMS history, advantages and limitations","DBMS users, modules and architecture","Data models and ER diagrams","Hierarchical, network and relational models","Relational algebra","Codd's rules, domain, tuple and cardinality","Normalization: 1NF, 2NF and 3NF","Insertion, update and deletion anomalies","Integrity constraints, assertions and triggers","Recovery, logs, checkpoints and shadow paging","Transactions and ACID properties","Concurrency: locks and timestamps","Optimistic scheduling and multiversion techniques","Distributed databases","Data warehouse and data mining"
  ],
  "SQL": [
    "Create and drop database","Create, modify, alter and drop table","INSERT, UPDATE and DELETE","SELECT queries and filtering","Aggregate functions: MAX, MIN, AVG, COUNT and SUM","GROUP BY and ORDER BY","HAVING clause"
  ]
};

export async function ensureSyllabus(userId) {
  let doc = await StudyData.findOne({ user: userId });
  if (!doc) {
    const topics = Object.entries(syllabus).flatMap(([section, list]) =>
      list.map(topic => ({ section, topic, status: "Not Started", confidence: "Medium", note: "" }))
    );
    doc = await StudyData.create({ user: userId, topics });
  } else if (doc.topics.length === 0) {
    doc.topics = Object.entries(syllabus).flatMap(([section, list]) =>
      list.map(topic => ({ section, topic }))
    );
    await doc.save();
  }
  return doc;
}