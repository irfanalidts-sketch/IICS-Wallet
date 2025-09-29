if(NOT TARGET fbjni::fbjni)
add_library(fbjni::fbjni SHARED IMPORTED)
set_target_properties(fbjni::fbjni PROPERTIES
    IMPORTED_LOCATION "/home/irfan/.gradle/caches/8.10.2/transforms/612dcfe2b482f4844bad312710cd27f9/transformed/jetified-fbjni-0.6.0/prefab/modules/fbjni/libs/android.x86_64/libfbjni.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/irfan/.gradle/caches/8.10.2/transforms/612dcfe2b482f4844bad312710cd27f9/transformed/jetified-fbjni-0.6.0/prefab/modules/fbjni/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

