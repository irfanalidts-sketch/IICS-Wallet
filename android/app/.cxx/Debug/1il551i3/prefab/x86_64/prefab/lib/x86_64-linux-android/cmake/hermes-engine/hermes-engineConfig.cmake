if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/home/irfan/.gradle/caches/8.10.2/transforms/399c2db72c4d492496fb5d9f0318eea7/transformed/jetified-hermes-android-0.76.9-debug/prefab/modules/libhermes/libs/android.x86_64/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/irfan/.gradle/caches/8.10.2/transforms/399c2db72c4d492496fb5d9f0318eea7/transformed/jetified-hermes-android-0.76.9-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

