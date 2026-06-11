@echo off
title CONG CU DEMO THANH TOAN MOMO
cls
echo =======================================================
echo     CONG CU GIA LAP WEBHOOK MOMO - DO AN BOOKSTORE
echo =======================================================
echo.
set /p order_id="1. Nhap Ma don hang hien tren Web MoMo (Vi du: 93_1780737159796): "
set /p sign_id="2. Nhap Chu ky hop le (Lay tu dong log chu ky dung cua Server): "
echo.
echo [He thong] Dang ban tin gia lap thanh toan ve localhost:3000...

curl -X POST http://localhost:3000/api/orders/momo-ipn -H "Content-Type: application/json" -d "{\"partnerCode\":\"MOMO\",\"orderId\":\"%order_id%\",\"requestId\":\"%order_id%\",\"amount\":\"25000\",\"orderInfo\":\"Thanh toan don hang\",\"orderType\":\"momo_wallet\",\"transId\":\"2304982304\",\"resultCode\":0,\"message\":\"Successful.\",\"payType\":\"qr\",\"responseTime\":\"1780736259290\",\"extraData\":\"\",\"signature\":\"%sign_id%\"}"

echo.
echo =======================================================
echo [Hoan tat] Hay kiem tra terminal Node.js de xem ket qua PAID!
echo =======================================================
pause
