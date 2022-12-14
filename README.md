# AntiSpoil
***
EECS 448 Project Repo for AntiSpoil Extension

## Overview

1. [Installation](#installation)
2. [Documentation](#documentation)
3. [Team Members](#team-members)
4. [Use](#use)
***

### Installation

#### Chrome / Edge
1. Download the zip of this project code
2. Extract the zip 
3. Navigate to `chrome://extensions`
4. Enable developer mode
5. Click load unpacked
6. Select the extracted root folder of this project

#### Firefox
1. Download the zip of this project code
2. Extract zip 
3. Open Firefox and go to `about:debugging#/runtime/this-firefox`
4. Click "Load Temporary Add-on...", navigate to the extracted code folder, and select the `manifest.json` file; then click "Open."
***
### Documentation
#### Vision Statement
> For the general public that cannot stand having their favorite show or movie spoiled, the AntiSpoil service provides a granular, on-demand web filter to hide content that may contain spoilers. AntiSpoil allows users to enter keywords or phrases relating to web content they do not want to see in order to give them a stress-free, spoiler-safe web experience. Rather than only hiding the user's keywords, AntiSpoil uses smart web-scraping technology to determine what sentences may contain words relating to the content users do not want to see. AntiSpoil will provide browser extensions for all major browsers to support multiple platforms such as Windows, macOS, and Linux. 	
#### Artifacts
* [Glossary](https://docs.google.com/document/d/1oGUS4yv7t2Wc-1o29BNczSuaYa3OHRIP/)
* [Software Requirements](https://docs.google.com/document/d/1CXPbO52UH3Ow4BcbkXYNVXLR6vMvowxN/edit?usp=sharing&ouid=113790454319257906381&rtpof=true&sd=true)
* [Use-Cases](https://docs.google.com/document/d/1gC8K-j8GhuKHQb6w6_TWKyhQVLxTjVH3/edit?usp=sharing&ouid=113790454319257906381&rtpof=true&sd=true)
* [Supplementary Specifications](https://docs.google.com/document/d/1J6KFFeSvlqnmXwg7vRfxll0KXZeSsHed/edit?usp=sharing&ouid=113790454319257906381&rtpof=true&sd=true)
* [Use-Case Realization](https://docs.google.com/document/d/1KubwuC54D13ZH-W6aORHc87emASkRSpv/edit?usp=sharing&ouid=113790454319257906381&rtpof=true&sd=true)
* [Software Architecture](https://docs.google.com/document/d/1tIr5GoNbSmOJjkxGFNHhiPPE2Y9tkpZs/edit?usp=sharing&ouid=113790454319257906381&rtpof=true&sd=true)
* [Meeting Logs](https://docs.google.com/document/d/1wA3ZzG0Fo3xpZ_FWHNn15B0ehL_J_z7AdZxFRHk3UL0/edit?usp=sharing)
***
### Team Members
* Eric Kuebler
* Kieran Delaney
* Kevin Likcani
* Matthew Mehrmann
* Nicholas Nguyen
* Paul Stuever
***
### Use
(add images below once UI is finalized)
- Open AntiSpoil in your Chrome Extensions

    ![chrome_icon](Images/ExtensionIconClosed.png)

- You can toggle AntiSpoil on by clicking the "Toggle" button
    - The extension icon will be dark when disabled

        ![Off_icon](Icons/favicon-32x32.png)

    - ...and will show red when enabled.
    
        ![on_icon](Icons/favicon-on-32x32.png)
- To block spoilers for a keyword or topic, click "Add Phrase" and type your keyword
    - AntiSpoil will automatically find related keywords and phrases to block.
    - Related phrases can be removed by clicking the down-arrow and removing them
- You can remove a full keyword or phrase by clicking the `x` next to it.
