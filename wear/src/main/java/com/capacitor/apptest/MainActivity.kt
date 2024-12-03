package com.capacitor.apptest

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.lifecycle.lifecycleScope
import com.capacitor.apptest.presentation.WearApp
import com.capacitor.apptest.presentation.detector.PhoneDetectorImpl
import com.capacitor.apptest.viewmodel.MainViewModel
import com.google.android.gms.wearable.MessageClient
import com.google.android.gms.wearable.MessageEvent
import com.google.android.gms.wearable.Wearable
import java.lang.reflect.Type
import com.google.gson.GsonBuilder
import com.google.gson.JsonDeserializationContext
import com.google.gson.JsonDeserializer
import com.google.gson.JsonElement
import com.google.gson.JsonParseException
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.launch
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Base64

class MainActivity : ComponentActivity(), MessageClient.OnMessageReceivedListener {

    private val mainViewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)
        setTheme(android.R.style.Theme_DeviceDefault)

        val capabilityClient = lazy { Wearable.getCapabilityClient(this) }
        val phoneDetector = lazy { PhoneDetectorImpl(capabilityClient.value) }

        lifecycleScope.launch {
            phoneDetector.value.phoneStatusFlow.collect { deviceInfo ->
                mainViewModel.updateDeviceInfo(deviceInfo)
            }
        }

        setContent {
            WearApp(mainViewModel)
        }
    }

    override fun onResume() {
        super.onResume()
        Wearable.getMessageClient(this).addListener(this)
    }

    override fun onDestroy() {
        super.onDestroy()
        Wearable.getMessageClient(this).removeListener(this)
    }

    override fun onMessageReceived(messageEvent: MessageEvent) {
        val data = String(messageEvent.data, Charsets.UTF_8)
        val uiComponents = parseUIComponents(data)
        mainViewModel.updateUITemplate(uiComponents)
    }


    private fun parseUIComponents(json: String): List<UIComponent> {
        val gson = GsonBuilder()
            .registerTypeAdapter(UIComponent::class.java, UIComponentAdapter())
            .create()
        val type = object : TypeToken<List<UIComponent>>() {}.type
        return gson.fromJson(json, type)
    }
}

class UIComponentAdapter : JsonDeserializer<UIComponent> {
    override fun deserialize(
        json: JsonElement,
        typeOfT: Type,
        context: JsonDeserializationContext
    ): UIComponent {
        val jsonObject = json.asJsonObject
        return when (val type = jsonObject.get("type").asString) {
            "Text" -> UIComponent.Text(
                content = jsonObject.get("content").asString
            )
            "Button" -> UIComponent.Button(
                label = jsonObject.get("label").asString,
                action = jsonObject.get("action").asString
            )
            "Image" -> UIComponent.Image(
                base64 = jsonObject.get("base64").asString
            )
            else -> throw JsonParseException("Unknown type: $type")
        }
    }
}

sealed class UIComponent {
    data class Text(val content: String) : UIComponent(), java.io.Serializable
    data class Button(val label: String, val action: String) : UIComponent(), java.io.Serializable
    data class Image(val base64: String) : UIComponent(), java.io.Serializable {
        fun toBitmap(): Bitmap {
            try {
                val cleanBase64 = base64.substringAfter("base64,")
                val decodedBytes = Base64.decode(cleanBase64, Base64.DEFAULT)
                return BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.size)
            } catch (e: IllegalArgumentException) {
                throw IllegalArgumentException("Invalid Base64 string: ${e.message}", e)
            }
        }
    }
}