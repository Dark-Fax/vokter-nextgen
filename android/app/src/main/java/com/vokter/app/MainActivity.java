package com.vokter.app;

import android.graphics.Color;
import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import androidx.activity.SystemBarStyle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // La app se dibuja detrás de las barras del sistema en todas las versiones de Android,
        // no solo en Android 15+. Así el margen inferior que Capacitor pasa a la web siempre
        // corresponde a la barra de navegación real y no se suma dos veces en Android 14 o anterior.
        EdgeToEdge.enable(this, SystemBarStyle.dark(Color.TRANSPARENT), SystemBarStyle.dark(Color.TRANSPARENT));
        super.onCreate(savedInstanceState);
    }
}
