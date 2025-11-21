//below code is from \\wsl.localhost\Ubuntu-22.04\home\irfan\New folder\Wallet\android\app\src\main\java\com\iics\wallet\SplashActivity.java

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
