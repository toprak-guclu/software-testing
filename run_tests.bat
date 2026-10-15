@echo off
setlocal
title Software Testing - SauceDemo
cd /d "%~dp0"

echo ==========================================
echo  Run the SauceDemo test suites
echo ==========================================
echo  1 = Playwright (63 runs: Chromium, Firefox, WebKit)
echo  2 = Selenium WebDriver (Java, needs Maven and Chrome)
echo  3 = Both
echo.
choice /c 123 /t 15 /d 1 /m "Which tests? (Playwright starts automatically in 15 seconds)"
set "PICK=%errorlevel%"
echo.

if "%PICK%"=="2" goto selenium

rem --- Playwright ------------------------------------------------------------------
where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js was not found. Install it from https://nodejs.org and run this file again.
    pause
    exit /b 1
)
pushd "saucedemo\playwright"
if not exist "node_modules" (
    echo Installing npm packages...
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed.
        popd
        pause
        exit /b 1
    )
)
echo Making sure the Playwright browsers are installed...
call npx playwright install
echo Running Playwright tests...
call npx playwright test
echo Opening the HTML report in a new window ^(close that window to stop the report server^)...
start "Playwright report" cmd /c "npx playwright show-report"
popd
if "%PICK%"=="1" goto done

:selenium
rem --- Selenium WebDriver (Java) ---------------------------------------------------
where mvn >nul 2>nul
if errorlevel 1 (
    echo [INFO] Maven was not found, skipping the Selenium tests.
    echo        Install Maven or open saucedemo\selenium-webdriver-java in IntelliJ IDEA and run the tests there.
    goto done
)
pushd "saucedemo\selenium-webdriver-java"
echo Running Selenium WebDriver tests...
call mvn -q test
popd

:done
echo.
echo Finished.
pause
exit /b 0
