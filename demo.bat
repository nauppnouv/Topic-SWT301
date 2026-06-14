@echo off
chcp 65001 >nul
title DateTimeChecker - E2E Testing Demo

:: Đường dẫn gốc
set ROOT=C:\Users\vq\Documents\FU\SU26\swt301\TopicTesting\DateTimeChecker

:MENU
cls
echo ======================================================
echo    DateTimeChecker - E2E Testing với Playwright
echo    SWT301 - FPT University
echo ======================================================
echo.
echo  1. Start Spring Boot App (mở cửa sổ mới)
echo  2. Reinstall npm + playwright browsers
echo  3. Run E2E tests (headed - thấy trình duyệt)
echo  4. Run E2E tests (headless - nhanh)
echo  5. Show HTML Report
echo  6. Visual Regression tests
echo  7. Stop Spring Boot
echo  8. Thoát
echo.
set /p chon="Chon (1-8): "

if "%chon%"=="1" goto START
if "%chon%"=="2" goto INSTALL
if "%chon%"=="3" goto E2E_HEADED
if "%chon%"=="4" goto E2E_HEADLESS
if "%chon%"=="5" goto REPORT
if "%chon%"=="6" goto VISUAL
if "%chon%"=="7" goto STOP
if "%chon%"=="8" goto EXIT
goto MENU

:START
cls
echo [B1] Dung port 8081 neu dang chay...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081') do (
    taskkill /f /pid %%a >nul 2>&1
)
echo [B2] Chay Spring Boot...
echo.
start "SpringBoot" cmd /k "java -jar "%ROOT%\target\datetimechecker-0.0.1-SNAPSHOT.jar""
echo Dang cho app khoi dong (15s)...
timeout /t 15 /nobreak >nul
start http://localhost:8081
echo App da mo tai http://localhost:8081
echo.
pause
goto MENU

:INSTALL
cls
cd /d "%ROOT%"
echo [Dang cai npm packages...]
call npm install
echo.
echo [Dang tai Chromium browser cho Playwright...]
call npx playwright install chromium
echo.
echo Xong! Nhan phim bat ky de quay lai menu.
pause
goto MENU

:E2E_HEADED
cls
cd /d "%ROOT%"
echo [Dang chay E2E tests - HEADED mode]
echo.
call npx playwright test tests/e2e/datetime.spec.ts --headed
echo.
pause
goto MENU

:E2E_HEADLESS
cls
cd /d "%ROOT%"
echo [Dang chay E2E tests - HEADLESS mode]
echo.
call npx playwright test tests/e2e/datetime.spec.ts
echo.
pause
goto MENU

:REPORT
cls
cd /d "%ROOT%"
echo [Mo HTML Report...]
start "Report" cmd /k "npx playwright show-report"
echo.
pause
goto MENU

:VISUAL
cls
cd /d "%ROOT%"
echo [Dang chay Visual Regression tests]
echo.
call npx playwright test tests/e2e/visual
echo.
pause
goto MENU

:STOP
cls
echo [Dang tat Spring Boot...]
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081') do (
    taskkill /f /pid %%a >nul 2>&1
)
echo Da tat!
echo.
pause
goto MENU

:EXIT
cls
echo Hen gap lai! 🐾
timeout /t 2 >nul
