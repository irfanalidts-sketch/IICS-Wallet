if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/home/irfan/.gradle/caches/8.10.2/transforms/6308a1d24d3ce96e5148dbc407a2ce5c/transformed/jetified-hermes-android-0.76.9-release/prefab/modules/libhermes/libs/android.armeabi-v7a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/irfan/.gradle/caches/8.10.2/transforms/6308a1d24d3ce96e5148dbc407a2ce5c/transformed/jetified-hermes-android-0.76.9-release/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

