import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 30 },
    title: { fontSize: 24, marginBottom: 20 },
    text: { fontSize: 12 }
});

export const SimpleAuditPDF = ({ website, score }: { website: string, score: number }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>Audit Report for {website}</Text>
            <Text style={styles.text}>Overall Score: {score}</Text>
        </Page>
    </Document>
);
