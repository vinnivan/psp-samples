# psp-samples
Public Sector Pursuits - Sample files

# Getting Started 

If not already installed, install Node v12 or greater from the official site https://nodejs.org/en/ 

To verify it was installed successfully from a command line enter “node --version” and you should see it echo its version. 

Any IDE or text editor can be used for the script development. The Chrome development tools will be used for debugging. 

The scripts will use Selenium to automate the Chrome browser. For this to work ChromeDriver needs to be installed. ChromeDriver is provided by google. However, there are two caveats. First the version of Chrome driver needs to match the version of Chrome that you have installed. And secondly Chrome needs to be installed at its default location.  

First step is to find your Chrome version. This can be found on the Chrome Help->About page.  Will look something like this: 



Now find the matching version from the Chrome Driver downloads page. Save the file “chromedriver.exe” to a directory that will need to be added to the system path. For example, c:\tools\chrome but really can be anywhere you want. Now you’ll need to add that directory to the system Path Environment variable. Here are the steps on how to do this on Windows. 

Note: Chrome will auto update from time to time. So if you start seeing errors where your script was working previously – verify the versions and if it has been updated then just follow the steps as described and update your chromedriver.exe.  

After updating the System Path Environment Variable open a new command window and type chromedriver and then press enter. You should see it display a message that it has successfully started chromedriver. Press ctrl+c to exit back to the command line.  

 

 
