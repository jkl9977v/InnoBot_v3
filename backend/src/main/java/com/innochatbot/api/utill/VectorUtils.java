package com.innochatbot.api.utill;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;

public class VectorUtils {
    private static final double EPS = 1e-8;
	
	// byte[] → float[] (저장 시 Little Endian으로 넣었으니 여기서도 동일하게 읽음)
    public static float[] bytesToFloatArray(byte[] bytes) {
        ByteBuffer buf = ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN);
        float[] out = new float[bytes.length / 4];
        for (int i = 0; i < out.length; i++) out[i] = buf.getFloat();
        return out;
    }
    
	// float[] → byte[] 변환 (PostgreSQL pgvector용, LE 방식)
	public static byte[] floatToBytesArray(float[] vec) {
		ByteBuffer buffer = ByteBuffer.allocate(vec.length * 4);
		buffer.order(ByteOrder.LITTLE_ENDIAN);
		for(float v : vec) buffer.putFloat(v);
		return buffer.array();	
	}

    // 코사인 유사도
    public static double cosine(float[] a, float[] b) {
        double dot = 0, na = 0, nb = 0;
        for (int i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            na  += a[i] * a[i];
            nb  += b[i] * b[i];
        }
        if (na == 0 || nb == 0) return 0;
        return dot / (Math.sqrt(na) * Math.sqrt(nb));
    }
    
    // L2 정규화 (cosine을 dot로 계산하고 싶을 때 유리)
    public static void l2NormalizeInPlace(float[] v) {
        double sum = 0;
        for (float x : v) sum += x * x;
        double norm = Math.sqrt(sum);
        if (norm == 0) return;
        for (int i = 0; i < v.length; i++) v[i] /= (float) norm;
    }
    


    // 제자리 L2 정규화. 성공하면 true, 실패(영벡터)면 false
    public static boolean l2NormalizeInPlaceBool(float[] v) {
        if (v == null || v.length == 0) return false;
        double sum = 0.0;
        for (int i = 0; i < v.length; i++) {
            double x = v[i];
            sum += x * x;
        }
        double norm = Math.sqrt(sum);
        if (norm < EPS) return false;
        float inv = (float)(1.0 / norm);
        for (int i = 0; i < v.length; i++) v[i] *= inv;
        return true;
    }
    
    // dot product (두 벡터가 이미 정규화되어 있다면 cosine과 동일)
    public static double dot(float[] a, float[] b) {
        double dot = 0;
        int len = Math.min(a.length, b.length);
        for (int i = 0; i < len; i++) dot += a[i] * b[i];
        return dot;
    }
}
