**Public Sector Pursuits** - sample scripts
# Getting Started 

If not already installed, install Node v12 or greater from the official site https://nodejs.org

To verify it was installed successfully from a command line enter “`node --version`” and you should see it echo its version. 

Any IDE or text editor can be used for the script development. The Chrome development tools will be used for debugging. 

The scripts will use [Selenium webdriver](https://www.selenium.dev/)  to automate the Chrome browser. For this to work ChromeDriver needs to be installed. ChromeDriver is provided by google. However, there are two caveats. First the version of Chrome driver needs to match the version of Chrome that you have installed. And secondly Chrome needs to be installed at its default location.  

First step is to find your Chrome version. This can be found on the Chrome Help->About Google Chrome page.  Will look something like this: 
**Version 85.0.4183.121 (Official Build) (64-bit)**



Now find the matching version from the Chrome Driver [downloads](https://sites.google.com/a/chromium.org/chromedriver/downloads) page. Save the file “chromedriver.exe” to a directory that will need to be added to the system path. For example, `c:\tools\chrome` but really can be anywhere you want. Now you’ll need to add that directory to the system Path Environment variable. Here are the [steps](https://www.addictivetips.com/windows-tips/set-path-environment-variables-in-windows-10/) on how to do this on Windows. 

> Chrome will auto update from time to time. So if you start seeing
> errors where your script was working previously – verify the versions
> and if it has been updated then just follow the steps as described and
> update your chromedriver.exe.

After updating the System Path Environment Variable open a new command window and type `chromedriver` and then press enter. You should see it display a message that it has successfully started ChromeDriver. Press ctrl+c to exit back to the command line.

Next clone or download this repo to a local working directory. Open a new command window and navigate to the working directory. Before running the script the dependency javascript files need to be retrieved. Type `npm install` and press enter. After this completes successfully the sample script can now be run. To do this type `node pearland.js` and press enter. If everything is working as expected you'll see Chrome open up, navigate to the Pearland city web site and then disappear and in the console window should be a list of the latest City Council Agenda links.




> Written with [StackEdit](https://stackedit.io/).
