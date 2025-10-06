package com.iics.wallet;


import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import com.iics.wallet.MainActivity;   // ← add this

public class SplashActivity extends AppCompatActivity {
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
    Intent intent = new Intent(this, MainActivity.class);
		startActivity(intent);
		finish();
	}
}
