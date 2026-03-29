#include <windows.h>
#include <cstdlib>

#define ID_EDIT_X      101
#define ID_EDIT_Y      102
#define ID_EDIT_W      103
#define ID_EDIT_H      104
#define ID_EDIT_R      105
#define ID_EDIT_G      106
#define ID_EDIT_B      107
#define ID_EDIT_A      108
#define ID_BTN_APPLY   109
#define ID_BTN_QUIT    110

HWND g_overlay = NULL;
HWND g_editX = NULL;
HWND g_editY = NULL;
HWND g_editW = NULL;
HWND g_editH = NULL;
HWND g_editR = NULL;
HWND g_editG = NULL;
HWND g_editB = NULL;
HWND g_editA = NULL;

int g_overlayX = 0;
int g_overlayY = -75;
int g_overlayW = 450;
int g_overlayH = 75;

int g_colorR = 30;
int g_colorG = 30;
int g_colorB = 30;
int g_alpha  = 255;

const char OVERLAY_CLASS[] = "OverlayWindowClass";
const char CONTROL_CLASS[] = "OverlayControlWindowClass";
const char INI_FILE[] = "overlayKodp.ini";

void SetEditInt(HWND hEdit, int value)
{
    char buf[32];
    wsprintfA(buf, "%d", value);
    SetWindowTextA(hEdit, buf);
}

int GetEditInt(HWND hEdit)
{
    char buf[32];
    GetWindowTextA(hEdit, buf, sizeof(buf));
    return atoi(buf);
}

int Clamp(int value, int minValue, int maxValue)
{
    if (value < minValue) return minValue;
    if (value > maxValue) return maxValue;
    return value;
}

void LoadConfig()
{
    g_overlayX = GetPrivateProfileIntA("overlay", "x", g_overlayX, INI_FILE);
    g_overlayY = GetPrivateProfileIntA("overlay", "y", g_overlayY, INI_FILE);
    g_overlayW = GetPrivateProfileIntA("overlay", "w", g_overlayW, INI_FILE);
    g_overlayH = GetPrivateProfileIntA("overlay", "h", g_overlayH, INI_FILE);

    g_colorR = GetPrivateProfileIntA("overlay", "r", g_colorR, INI_FILE);
    g_colorG = GetPrivateProfileIntA("overlay", "g", g_colorG, INI_FILE);
    g_colorB = GetPrivateProfileIntA("overlay", "b", g_colorB, INI_FILE);
    g_alpha  = GetPrivateProfileIntA("overlay", "a", g_alpha, INI_FILE);

    if (g_overlayW <= 0) g_overlayW = 1;
    if (g_overlayH <= 0) g_overlayH = 1;

    g_colorR = Clamp(g_colorR, 0, 255);
    g_colorG = Clamp(g_colorG, 0, 255);
    g_colorB = Clamp(g_colorB, 0, 255);
    g_alpha  = Clamp(g_alpha, 0, 255);
}

void SaveConfig()
{
    char buf[32];

    wsprintfA(buf, "%d", g_overlayX);
    WritePrivateProfileStringA("overlay", "x", buf, INI_FILE);

    wsprintfA(buf, "%d", g_overlayY);
    WritePrivateProfileStringA("overlay", "y", buf, INI_FILE);

    wsprintfA(buf, "%d", g_overlayW);
    WritePrivateProfileStringA("overlay", "w", buf, INI_FILE);

    wsprintfA(buf, "%d", g_overlayH);
    WritePrivateProfileStringA("overlay", "h", buf, INI_FILE);

    wsprintfA(buf, "%d", g_colorR);
    WritePrivateProfileStringA("overlay", "r", buf, INI_FILE);

    wsprintfA(buf, "%d", g_colorG);
    WritePrivateProfileStringA("overlay", "g", buf, INI_FILE);

    wsprintfA(buf, "%d", g_colorB);
    WritePrivateProfileStringA("overlay", "b", buf, INI_FILE);

    wsprintfA(buf, "%d", g_alpha);
    WritePrivateProfileStringA("overlay", "a", buf, INI_FILE);
}

HWND CreateOverlay(HINSTANCE hInstance, int x, int y, int w, int h)
{
    HWND hwnd = CreateWindowExA(
        WS_EX_TOPMOST | WS_EX_LAYERED | WS_EX_TRANSPARENT | WS_EX_TOOLWINDOW,
        OVERLAY_CLASS,
        "Overlay",
        WS_POPUP,
        x, y, w, h,
        NULL,
        NULL,
        hInstance,
        NULL
    );

    if (hwnd)
    {
        SetLayeredWindowAttributes(hwnd, 0, (BYTE)g_alpha, LWA_ALPHA);
        ShowWindow(hwnd, SW_SHOW);
        UpdateWindow(hwnd);
    }

    return hwnd;
}

void UpdateGlobalsFromControls()
{
    g_overlayX = GetEditInt(g_editX);
    g_overlayY = GetEditInt(g_editY);
    g_overlayW = GetEditInt(g_editW);
    g_overlayH = GetEditInt(g_editH);

    g_colorR = GetEditInt(g_editR);
    g_colorG = GetEditInt(g_editG);
    g_colorB = GetEditInt(g_editB);
    g_alpha  = GetEditInt(g_editA);

    if (g_overlayW <= 0) g_overlayW = 1;
    if (g_overlayH <= 0) g_overlayH = 1;

    g_colorR = Clamp(g_colorR, 0, 255);
    g_colorG = Clamp(g_colorG, 0, 255);
    g_colorB = Clamp(g_colorB, 0, 255);
    g_alpha  = Clamp(g_alpha, 0, 255);

    SetEditInt(g_editW, g_overlayW);
    SetEditInt(g_editH, g_overlayH);
    SetEditInt(g_editR, g_colorR);
    SetEditInt(g_editG, g_colorG);
    SetEditInt(g_editB, g_colorB);
    SetEditInt(g_editA, g_alpha);
}

void RecreateOverlay(HINSTANCE hInstance)
{
    UpdateGlobalsFromControls();

    if (g_overlay)
    {
        DestroyWindow(g_overlay);
        g_overlay = NULL;
    }

    g_overlay = CreateOverlay(hInstance, g_overlayX, g_overlayY, g_overlayW, g_overlayH);
    SaveConfig();
}

LRESULT CALLBACK OverlayProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam)
{
    switch (msg)
    {
        case WM_NCHITTEST:
            return HTTRANSPARENT;

        case WM_PAINT:
        {
            PAINTSTRUCT ps;
            HDC hdc = BeginPaint(hwnd, &ps);

            HBRUSH brush = CreateSolidBrush(RGB(g_colorR, g_colorG, g_colorB));
            FillRect(hdc, &ps.rcPaint, brush);
            DeleteObject(brush);

            EndPaint(hwnd, &ps);
            return 0;
        }

        case WM_DESTROY:
            return 0;
    }

    return DefWindowProcA(hwnd, msg, wParam, lParam);
}

LRESULT CALLBACK ControlProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam)
{
    switch (msg)
    {
        case WM_CREATE:
        {
            HINSTANCE hInstance = ((LPCREATESTRUCT)lParam)->hInstance;

            // Colonne gauche : position / taille
            CreateWindowA("STATIC", "Position X :", WS_CHILD | WS_VISIBLE,
                10, 15, 90, 20, hwnd, NULL, hInstance, NULL);
            g_editX = CreateWindowExA(WS_EX_CLIENTEDGE, "EDIT", "",
                WS_CHILD | WS_VISIBLE | ES_AUTOHSCROLL,
                110, 12, 80, 24, hwnd, (HMENU)ID_EDIT_X, hInstance, NULL);

            CreateWindowA("STATIC", "Position Y :", WS_CHILD | WS_VISIBLE,
                10, 45, 90, 20, hwnd, NULL, hInstance, NULL);
            g_editY = CreateWindowExA(WS_EX_CLIENTEDGE, "EDIT", "",
                WS_CHILD | WS_VISIBLE | ES_AUTOHSCROLL,
                110, 42, 80, 24, hwnd, (HMENU)ID_EDIT_Y, hInstance, NULL);

            CreateWindowA("STATIC", "Largeur :", WS_CHILD | WS_VISIBLE,
                10, 75, 90, 20, hwnd, NULL, hInstance, NULL);
            g_editW = CreateWindowExA(WS_EX_CLIENTEDGE, "EDIT", "",
                WS_CHILD | WS_VISIBLE | ES_AUTOHSCROLL,
                110, 72, 80, 24, hwnd, (HMENU)ID_EDIT_W, hInstance, NULL);

            CreateWindowA("STATIC", "Hauteur :", WS_CHILD | WS_VISIBLE,
                10, 105, 90, 20, hwnd, NULL, hInstance, NULL);
            g_editH = CreateWindowExA(WS_EX_CLIENTEDGE, "EDIT", "",
                WS_CHILD | WS_VISIBLE | ES_AUTOHSCROLL,
                110, 102, 80, 24, hwnd, (HMENU)ID_EDIT_H, hInstance, NULL);

            // Colonne droite : couleur + alpha
            int colXLabel = 220;
            int colXEdit  = 310;

            CreateWindowA("STATIC", "Rouge (R) :", WS_CHILD | WS_VISIBLE,
                colXLabel, 15, 80, 20, hwnd, NULL, hInstance, NULL);
            g_editR = CreateWindowExA(WS_EX_CLIENTEDGE, "EDIT", "",
                WS_CHILD | WS_VISIBLE | ES_AUTOHSCROLL,
                colXEdit, 12, 80, 24, hwnd, (HMENU)ID_EDIT_R, hInstance, NULL);

            CreateWindowA("STATIC", "Vert (G) :", WS_CHILD | WS_VISIBLE,
                colXLabel, 45, 80, 20, hwnd, NULL, hInstance, NULL);
            g_editG = CreateWindowExA(WS_EX_CLIENTEDGE, "EDIT", "",
                WS_CHILD | WS_VISIBLE | ES_AUTOHSCROLL,
                colXEdit, 42, 80, 24, hwnd, (HMENU)ID_EDIT_G, hInstance, NULL);

            CreateWindowA("STATIC", "Bleu (B) :", WS_CHILD | WS_VISIBLE,
                colXLabel, 75, 80, 20, hwnd, NULL, hInstance, NULL);
            g_editB = CreateWindowExA(WS_EX_CLIENTEDGE, "EDIT", "",
                WS_CHILD | WS_VISIBLE | ES_AUTOHSCROLL,
                colXEdit, 72, 80, 24, hwnd, (HMENU)ID_EDIT_B, hInstance, NULL);

            CreateWindowA("STATIC", "Alpha (A) :", WS_CHILD | WS_VISIBLE,
                colXLabel, 105, 80, 20, hwnd, NULL, hInstance, NULL);
            g_editA = CreateWindowExA(WS_EX_CLIENTEDGE, "EDIT", "",
                WS_CHILD | WS_VISIBLE | ES_AUTOHSCROLL,
                colXEdit, 102, 80, 24, hwnd, (HMENU)ID_EDIT_A, hInstance, NULL);

            CreateWindowA("BUTTON", "Appliquer",
                WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
                10, 160, 180, 30, hwnd, (HMENU)ID_BTN_APPLY, hInstance, NULL);

            CreateWindowA("BUTTON", "Fermer",
                WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
                220, 160, 170, 30, hwnd, (HMENU)ID_BTN_QUIT, hInstance, NULL);

            SetEditInt(g_editX, g_overlayX);
            SetEditInt(g_editY, g_overlayY);
            SetEditInt(g_editW, g_overlayW);
            SetEditInt(g_editH, g_overlayH);
            SetEditInt(g_editR, g_colorR);
            SetEditInt(g_editG, g_colorG);
            SetEditInt(g_editB, g_colorB);
            SetEditInt(g_editA, g_alpha);

            return 0;
        }

        case WM_COMMAND:
        {
            int id = LOWORD(wParam);

            if (id == ID_BTN_APPLY)
            {
                RecreateOverlay((HINSTANCE)GetWindowLongPtr(hwnd, GWLP_HINSTANCE));
                return 0;
            }
            else if (id == ID_BTN_QUIT)
            {
                DestroyWindow(hwnd);
                return 0;
            }
            break;
        }

        case WM_DESTROY:
            if (g_overlay)
            {
                DestroyWindow(g_overlay);
                g_overlay = NULL;
            }
            PostQuitMessage(0);
            return 0;
    }

    return DefWindowProcA(hwnd, msg, wParam, lParam);
}

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE, LPSTR, int nCmdShow)
{
    LoadConfig();

    WNDCLASSA wcOverlay = {};
    wcOverlay.lpfnWndProc = OverlayProc;
    wcOverlay.hInstance = hInstance;
    wcOverlay.lpszClassName = OVERLAY_CLASS;
    wcOverlay.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
    RegisterClassA(&wcOverlay);

    WNDCLASSA wcControl = {};
    wcControl.lpfnWndProc = ControlProc;
    wcControl.hInstance = hInstance;
    wcControl.lpszClassName = CONTROL_CLASS;
    wcControl.hbrBackground = (HBRUSH)(COLOR_BTNFACE + 1);
    wcControl.hCursor = LoadCursor(NULL, IDC_ARROW);
    RegisterClassA(&wcControl);

    g_overlay = CreateOverlay(hInstance, g_overlayX, g_overlayY, g_overlayW, g_overlayH);

    HWND hwndControl = CreateWindowExA(
        0,
        CONTROL_CLASS,
        "OverlayKodp.exe",
        WS_OVERLAPPED | WS_CAPTION | WS_SYSMENU | WS_MINIMIZEBOX,
        200, 200, 430, 250,
        NULL,
        NULL,
        hInstance,
        NULL
    );

    ShowWindow(hwndControl, nCmdShow);
    UpdateWindow(hwndControl);

    MSG msg;
    while (GetMessage(&msg, NULL, 0, 0))
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }

    return 0;
}