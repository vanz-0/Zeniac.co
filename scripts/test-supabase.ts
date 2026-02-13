
import { saveAnalysisResult, getRecentAnalysis } from '../src/lib/db-actions';
import { supabase } from '../src/lib/supabase';

async function testSupabase() {
    console.log('🧪 Testing Supabase Connection...');

    const testDomain = 'test-connection_' + Date.now() + '.com';
    const testData = {
        score: 100,
        techStack: 'Test',
        businessType: 'Test',
        services: [],
        inferredPainPoints: [],
        competitorGap: 'None'
    };

    try {
        // 1. Test Save
        console.log(`📝 Attempting to save analysis for ${testDomain}...`);
        await saveAnalysisResult(null, testDomain, testData.score, testData as any);
        console.log('✅ Save successful!');

        // 2. Test Retrieve
        console.log(`🔍 Attempting to retrieve analysis for ${testDomain}...`);
        const result = await getRecentAnalysis(testDomain);

        if (result && result.domain === testDomain) {
            console.log('✅ Retrieval successful!');
        } else {
            console.error('❌ Retrieval failed: Data mismatch or not found.', result);
        }

        // 3. Cleanup (Optional, good practice)
        console.log('🧹 Cleaning up test data...');
        const { error } = await supabase.from('analyses').delete().eq('domain', testDomain);
        if (error) console.warn('⚠️ Cleanup warning:', error.message);
        else console.log('✅ Cleanup successful!');

    } catch (error) {
        console.error('❌ Test Failed:', error);
        process.exit(1);
    }
}

testSupabase();
