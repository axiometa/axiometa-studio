import React from 'react';
import { colors, fontFamily } from '../../../styles/theme';

const styles = {
  title: {
    fontSize: '2.25rem',
    marginBottom: '1.5rem',
    color: colors.primary,
    fontFamily
  },
  content: {
    fontSize: '1.125rem',
    lineHeight: '1.8',
    color: colors.text.secondary,
    marginBottom: '2rem',
    whiteSpace: 'pre-line',
    fontFamily
  }
};

export default function InfoStep({ title, content }) {
  return (
    <>
      <h1 style={styles.title}>{title}</h1>
      <p style={styles.content}>{content}</p>
    </>
  );
}
