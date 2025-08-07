# START PROJECT ASSESSMENTS 

# START PROJECT ASSESSMENTS AND CAPTURED DATA REVIEW 

 
 

1. CHILD ASSESSMENT 
 

1.1.Eye-tracking test 

 

1.1.1. Visual implementation on the app level 
Before the test, a Social worker will be moved to the instruction page, 
where s(he) will be able to read the information about how to conduct a 
test and check the results. It is possible that before the test, a calibration 
process needs to be done (what calibration is required and how to 
gamify will be ascertained after we undertake eye-tracking due 
diligence).  The eye-tracking test will contain two types of test: 

 



Preferential Looking Test (5 image pairs) ​and​ Attention 
Disengagement Test (5-10 tests). ​The Attention Disengagement Test 
will be presented into two forms: ​Baseline  ​and ​Overlap. ​During the 
assessment, the Attention Disengagement Test will be shown intermixed 
(Baseline and Overlaps)​. ​Each​ ​Attention Disengagement Test​ ​will be 
preceded by a central fixation slide.   

 
1.1.2. Eye-tracking test examples: 

1.1.2.1. Preferential looking test​.  Two images/videos on the 
screen. Number of tests = 5 (5 pairs). Duration of each test = 5 
seconds.   There is no demo test for this test.  

 

 
 

1.1.2.2. Attention disengagement test​.  Number of tests = 5-10. 
Duration of each test = 5 seconds.  A central stimulus between 
tests will be presented to orient attention. Two trials follow; ​1) 
Baseline test​. Here, the central stimulus disappears and a 
peripheral stimulus appears. ​2) Overlap test​ . Here, the central 
stimulus stays on and a peripheral stimulus appears at the same y 
coordinate.  The tests will be shown intermixed: 

E.g: Baseline -Central Fixation screen - Baseline -Central Fixation 
screen - Overlap - Central Fixation screen - Overlap - Central Fixation 
screen -  Baseline.   
 

Before the test a SW will be able to demonstrate the demo attempt/test to a 
child.  
 

Baseline test 
 

 



 
 

Overlap test 
 

 
 
 
Central fixation slide:  

 

 
The Attention Disengagement Test  sample - 

https://sites.google.com/site/taskenginedoc/task-packages/gap-overlap 
 

 



1.1.3. Additional measurement 
1.1.3.1. Data Quality measure.​  During the test (which lasts 50-60 

seconds) the app should calculate what % of the time a child is 
looking on the screen by detecting the child’s gaze (eyes). If during 
the test the app detects that the gaze time on screen is less than 
50%, the test will be considered as failed. The social worker will be 
able to make another attempt. A SW won’t be able to delete the test 
attempt. 
 

1.1.3.2. Video recording.​ The video footage of the child doing the 
eye-tracking task needs to be recorded using the front-camera. 
Video recording should start at the beginning of each trial, and stop 
at its end. It is possible that each trial having a separate video file, 
that is completely synch-ed to the gaze event.  It is also possible to 
keep all trials in on test, but the main point that we need exactly 
identify when each stimuli starts and ends on the screen.   

 
 

1.1.4. Main output (results) for the backend 
 

1.1.4.1. Timestamp of XY coordinates and stimuli display times. 
On the backend level the operators will see the date of the test and a 
link to download an Excel file and HTML page containing the results. 
The file will contain the information about; X and Y coordinates, 
activity name, timestamp and first look field. For each test, the system 
will collect coordinates with maximum possible FPS (based on device 
and eye-tracking features).   The file structure (approximately): 

 

 



 
 

1.1.4.2. Data Quality measure. ​A backend operator will be able to 
see the​ ​output result of the Data Quality measurement in % (just 
number, for example “67%”). This result will be placed in the 
exported file and the page together with the data from 1.1.4.1. 

 
1.1.4.3. Video recording.  ​The​ ​operators will be able to view the 

recording on the backend and also download the video file (files). 
 

1.1.5. Results visible to a social worker (on the app level) 
A social worker will be able to see the output result of the Data 
Quality measurement in % (​e.g. 67%​) and information about the test 
length and make a decision to leave or make another attempt (up to 
3).   They will also be able to watch the video which was recorded 
during the test.  
 

1.1.6. Who will undertake the test and where should the device be 
placed? 

The device will be held by a SW. SW will instruct the parents and 
child how to sit and set the distance between a child and the the 
device.  
 

1.1.7. Tests number and length 
10 trails for 2 tests  (5 for ​Preferential Looking Test​, 5(?) for 
Attention Disengagement Test  ​and​ ​4​ Central fixation screens​) by 

 



5 second – 70 seconds (approximately). The duration and trials 
number can be changed.  
 

1.1.8. Video length, quality and size 
~ 1.5 minute. 
 

1.1.10 As attempt has been finished a SW will get the pop-up with 3 
options:  

- Make new attempt (no more than 2 times)  
- Go to the test selection page  
- Go to the next test. If the test last in the raw, a SW won’t be able to 

select this option and has to the Assessment selection page.  
 

1.2.Choice Touching test 
During this test, the app will show two buttons (Red and Blue) on the screen. 
Before the test a SW will show to a child 3-4  example trials.  After the 
introduction, the real test will begin. There will be 8 trials for the test. A child 
will be able to press each button several times. The buttons will contain the 
social or non-social videos which will be demonstrated to a child. The video 
will not change. 

 
Before the test a SW will be able to demonstrate the demo attempt/test to a 

child. 
 
1.2.1. Choice Touching test example 

 

 
 

1.2.2. Main output (results) for the backend 
On the backend level the operators will see the date of the test and a 

 



link to download an Excel file and HTML page containing the results. 
The file will contain the information about the number of touches, their 
coordinates (X and Y), Z –axis acceleration (tap force), X- and Y-axis 
accelerations (these reflect motion of the device itself, from which we 
can identify any response-anticipatory or cueing movements) and 
timestamps. 
 

 
 

1.2.3. Results visible to a social worker (on the app level) 
A social worker will be able to see via the app how many touches were 
recorded for the child and the information about the test length. If the 
number is insufficient (e.g, a child refused to press the screen) a social 
worker will be able to do the next attempt. 

 
1.2.4.  Who will undertake the test and where should the device be 

placed? 
The device should be placed/fixed on the flat surface/table.  A child 

will press the buttons on the screen. 
 

1.2.5. Test length 
4 demonstration trials and 8 real trials. Assessment won’t have 
automatic time constraints.  
 

1.2.6. Video length and quality 
No video recording activity required for this test. 
 

1.2.7 As attempt has been finished a SW will get the pop-up with 3 
options:  

- Make new attempt (no more than 2 times)  
- Go to the test selection page  
- Go to the next test. If the test last in the order, a SW won’t be able to 

select this option and has to the Assessment selection page.  
 
 

 
1.3.Motor Following task 

 
A bee (width no more 1 cm) will appear from one side of the screen and 
move in zig-zag motion across the screen with variable speed and 
acceleration (3 speed levels, 2 accelerations between speed levels). The test 
will have 3 trials. User will be expected to chase the bee while tracing.  The 
bee’s colour should be bright, bee will “make” sound while it moves. Once a 
child has “caught” the bee, there will be another sound.  
 

 



Before the test a SW will be able to demonstrate the attempt/test to a child. 
 

 
1.3.1. Motor Following test example 

 

 
 

1.3.2. Main output (results) for the backend 
On the backend level the operators will see the date of the test (HTML 
page and downloadable Excel file ) and a link to download the image. 
The image will contain a path line made by the participant and the 
original path of the Bee plotted on the same image. The raw data file 
will keep the information about X and Y coordinates of the leading dot 
and the participant's following dots and timestamp data.  The raw 
data file also will hold X, Y and Z accelerations; the Z data will 
measure force at initial and any subsequent touchscreen contacts and 
the X and Y data will capture any anticipatory movements of the 
device itself. 
 

 
 

1.3.3. Results visible to a social worker (on the app level) 
A social worker will be able to see the image with a path line made by 
the participant and the original path made by the Bee plotted on the 
same image. A social worker will be able to  do the next attempt  if the 
result is deemed invalid. 

 
1.3.4. Who will undertake the test and where should the device will be 

 



placed? 
The device should be placed/fixed on the flat surface/table.  A child 

will touch the screen. 
 

1.3.5. Test length 
 Tests will finished by timeout.  Once the bee reaches the edge, a child 
will have some time to repeat the bee path and catch the bee. 
 

1.3.6. Video length and quality 
No video recording activity required for this test. 
 

1.3.7 As attempt has been finished a SW will get the pop-up with 3 
options:  

- Make new attempt (no more than 2 times)  
- Go to the test selection page  
- Go to the next test. If the test last in the order, a SW won’t be able to 

select this option and has to the Assessment selection page.  
 
 

1.4. Jab a finger at bubbles (Jabble) 
 
Soap bubbles randomly appear on the screen. Initially this will be only one 
bubble. The number will then increase to 2, 3, 4, 5, and 6 simultaneously 
appearing  on the screen (sliding down from the top or sliding up from 
bottom of the screen, not overlapping). Their size will be same, thus bubbles 
won’t change their size.  The bubbles will move up and when they reach the 
top, they will move down. All bubbles will move at a fixed velocity. The 
bubbles won’t touch each other . If the child pops the bubble there needs to 
be a audio/ fireworks display (gamify element). 
 
Before the test a SW will be able to demonstrate the demo attempt/test to a 

child.  
 
1.4.1. Jabble test example 

 

 



 
 

 
1.4.2. Main output (results) for the backend 

On the backend level the operators will see the date of the test and a 
link to download an Excel file containing the results. The operators will 
not be able to see the results on the backend interface. The file will 
contain the information about:  

● the participant's touch coordinates (X and Y, for all 
instantaneous and ongoing touches); 

● Z–axis acceleration (tap force); 
● X and Y coordinates of the centres of all the bubbles displayed 

on screen at that moment; 
● X- and Y-axis accelerations (movements of the device itself);  
● timestamps; 
● special mark which will indicate if the bubble were popped. 

 

 
 

1.4.3. Results visible to a social worker (on the app level) 
A social worker will be able to see how many bubbles were popped 
during the test. A social worker will be able to do the next attempt  if 
the result is deemed invalid. 
 

1.4.4. Who will undertake the test and where should the device be 
placed? 
The device should be placed/fixed on a flat surface/table.  A child will 

press the bubbles on the screen. 
 

1.4.5. Test length 

 



Test will finish by timeout (after 4 minutes) or when the last bubble is 
popped. 
 

1.4.6. Video length and quality 
No video recording activity required for this test. 
 

1.4.7 As attempt has been finished a SW will get the pop-up with 3 
options:  

- Make new attempt (no more than 2 times)  
- Go to the test selection page  
- Go to the next test. If the test last in the order, a SW won’t be able to 

select this option and has to the Assessment selection page.  
 

 
1.5 Colouring in task 
 
Child will be asked to colour (full-fill) in the line drawing of an animal (e.g. below). 
The image must fill 80% of screen. The finger trace will be circular, .5 cm in 
diameter. Children will be given the option to choose one colour to use throughout 
the task. The Child will be able to set the size of the brush and select “eraser” to 
delete colouring.  The SW will demonstrate colour choice and colouring on a 
different drawing.  The test can have up to 3 trials.  
 
Example of colouring test: 
 

 
 
1.5.1  ​Main output (results) for the backend 

On the backend level the operators will see the date of the test (HTML 
page and downloadable Excel file ). The raw data file will keep the 
information about X and Y coordinates of participant's touches, an 
image position and timestamp data.  The raw data file also will hold X, 
Y and Z accelerations; the Z data will measure force at initial and any 
subsequent touchscreen contacts and the X and Y data will capture 

 



any anticipatory movements of the device itself.  Also BO will be able 
to see and download the the coloured-in image. 
 

 
 

1.5.2 Results visible to a social worker (on the app level) 
A social worker will be able to see the the coloured-in image and 
judge whether the task can be validated 
 

1.5.3. Who will undertake the test and where should the device will be placed? 
The device should be placed/fixed on the flat surface/table.  A child 

will touch the screen 
 

1.5.4 Test length 
The task will be finished when the child indicates they have finished or 

after 2 minutes, whichever comes first 
 
 

1.5.5 Video length and quality 
No video recording activity required for this test. 
 

1.5.6 As attempt has been finished a SW will get the pop-up with 3 options:  
- Make new attempt (no more than 2 times)  
- Go to the test selection page  
- Go to the next test. If the test last in the order, a SW won’t be able to 

select this option and has to the Assessment selection page.  
 

 
 
2. PARENT ASSESSMENT 

 
2.1. Multiple-choice questions.​ Parents will answer multiple-choice questions. 

There will be 10-20 questions in sequence. Some of these questions can 
include making a choice between two videos. The parents will be asked to 
indicate which of the videos is a better representation of their child.  A 
parent will not be able to skip any questions. A parent can return to any 
question and will be able to change his/her answer. They will not be able to 
change answers once a SW ends/submits the test.  A SW will conduct the 
test. 
 
2.1.1. Multiple choice test examples: 

 

 



 
 

2.1.2 Main output (results) for the backend 
On the backend level the operators will see the date of the test and a 

link to download an Excel file containing the results. The operators will not be 
able to see the results on the backend interface. The file structure: 

 

 



 
 
2.1.3  Results visible to a social worker (on the app level) 
  A Social worker will only see the test status: ​Complete/Incomplete​. 
No result will be available to a social worker 
 
2.1.4  Who will undertake the test and where should the device be 
placed? 

A social worker conduct the test and will select the answers based on 
the parent's response 
 
2.1.5  Test length 

No time restriction 
 

2.2. Parent video and audio recording. ​On demand a SW could record the 
video (with audio) with the parent(s). A SW will be able to skip this step if 
there is no necessity to record video. 
 
2.2.1. Main output (results) for the backend  

The​ ​operators will be able to view the results on the backend and 
download the video file 
 

2.2.2. Results visible to a social worker (on the app level) 
A SW will be able to view the video on the device, delete it and 
re-capture it again 

 
2.2.3. Who will undertake the test and where should the device will be 

placed? 
A social worker will conduct the recording and will keep the device 
 

2.2.4    Video length, quality and size 
          ​ ​5-7 minutes 
 

 



 
 
