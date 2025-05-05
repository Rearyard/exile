<script lang="ts" setup>
import {Editor, EditorContent, mergeAttributes} from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Heading from '@tiptap/extension-heading';
import {Blockquote} from '@tiptap/extension-blockquote';
import {Paragraph} from '@tiptap/extension-paragraph';

const editor = shallowRef<Editor | undefined>(undefined);
useProvideWorkEditorMetaSheet()
provide('editor', editor);

const headingClasses = {
  1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
  2: 'mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
  3: 'mt-8 scroll-m-20 text-2xl font-semibold tracking-tight',
};

onMounted(() => {
  editor.value = new Editor({
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: {level: 1},
          content: [{type: 'text', text: 'Hello World!'}],
        },
        {
          type: 'paragraph',
          content: [{type: 'text', text: 'This is a paragraph.'}],
        },
        {
          type: 'heading',
          attrs: {level: 1},
          content: [{type: 'text', text: 'Hello World!'}],
        },
        {
          type: 'paragraph',
          content: [{type: 'text', text: 'This is a paragraph.'}],
        },{
          type: 'heading',
          attrs: {level: 1},
          content: [{type: 'text', text: 'Hello World!'}],
        },
        {
          type: 'paragraph',
          content: [{type: 'text', text: 'This is a paragraph.'}],
        },{
          type: 'heading',
          attrs: {level: 1},
          content: [{type: 'text', text: 'Hello World!'}],
        },
        {
          type: 'paragraph',
          content: [{type: 'text', text: 'This is a paragraph.'}],
        },{
          type: 'heading',
          attrs: {level: 1},
          content: [{type: 'text', text: 'Hello World!'}],
        },
        {
          type: 'paragraph',
          content: [{type: 'text', text: 'This is a paragraph.'}],
        },{
          type: 'heading',
          attrs: {level: 1},
          content: [{type: 'text', text: 'Hello World!'}],
        },
        {
          type: 'paragraph',
          content: [{type: 'text', text: 'This is a paragraph.'}],
        },{
          type: 'heading',
          attrs: {level: 1},
          content: [{type: 'text', text: 'Hello World!'}],
        },
        {
          type: 'paragraph',
          content: [{type: 'text', text: 'This is a paragraph.'}],
        },{
          type: 'heading',
          attrs: {level: 1},
          content: [{type: 'text', text: 'Hello World!'}],
        },
        {
          type: 'paragraph',
          content: [{type: 'text', text: 'This is a paragraph.'}],
        },{
          type: 'heading',
          attrs: {level: 1},
          content: [{type: 'text', text: 'Hello World!'}],
        },
        {
          type: 'paragraph',
          content: [{type: 'text', text: 'This is a paragraph.'}],
        },{
          type: 'heading',
          attrs: {level: 1},
          content: [{type: 'text', text: 'Hello World!'}],
        },
        {
          type: 'paragraph',
          content: [{type: 'text', text: 'This is a paragraph.'}],
        },{
          type: 'heading',
          attrs: {level: 1},
          content: [{type: 'text', text: 'Hello World!'}],
        },
        {
          type: 'paragraph',
          content: [{type: 'text', text: 'This is a paragraph.'}],
        },{
          type: 'heading',
          attrs: {level: 1},
          content: [{type: 'text', text: 'Hello World!'}],
        },
        {
          type: 'paragraph',
          content: [{type: 'text', text: 'This is a paragraph.'}],
        },{
          type: 'heading',
          attrs: {level: 1},
          content: [{type: 'text', text: 'Hello World!'}],
        },
        {
          type: 'paragraph',
          content: [{type: 'text', text: 'This is a paragraph.'}],
        },{
          type: 'heading',
          attrs: {level: 1},
          content: [{type: 'text', text: 'Hello World!'}],
        },
        {
          type: 'paragraph',
          content: [{type: 'text', text: 'This is a paragraph.'}],
        },{
          type: 'heading',
          attrs: {level: 1},
          content: [{type: 'text', text: 'Hello World!'}],
        },
        {
          type: 'paragraph',
          content: [{type: 'text', text: 'This is a paragraph.'}],
        },{
          type: 'heading',
          attrs: {level: 1},
          content: [{type: 'text', text: 'Hello World!'}],
        },
        {
          type: 'paragraph',
          content: [{type: 'text', text: 'This is a paragraph.'}],
        },{
          type: 'heading',
          attrs: {level: 1},
          content: [{type: 'text', text: 'Hello World!'}],
        },
        {
          type: 'paragraph',
          content: [{type: 'text', text: 'This is a paragraph.'}],
        },
      ],
    },
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        paragraph: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }).extend({
        renderHTML({node, HTMLAttributes}) {
          const level = node.attrs.level;
          return [
            `h${level}`,
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
              class: `${headingClasses[level]}`,
            }),
            0,
          ];
        },
      }),
      Blockquote.configure({}).extend({
        renderHTML({HTMLAttributes}) {
          return [
            'blockquote',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
              class: 'mt-6 border-l-2 pl-6 text-muted-foreground',
            }),
            0,
          ];
        },
      }),
      Paragraph.configure({}).extend({
        renderHTML({HTMLAttributes}) {
          return [
            'p',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
              class: 'leading-7 [&:not(:first-child)]:mt-4',
            }),
            0,
          ];
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      })],
  });
  const json = editor.value.getJSON();
  console.log('json', json);
});
</script>

<template>
  <div>
    <EditorWorkToolBar class="sticky top-0 bg-background z-10"/>
    <div class="container mx-auto p-6 relative">
      <EditorContent :editor="editor" class="flex-1"/>
    </div>
  </div>
</template>

<style scoped>
:deep(.tiptap) {
  outline: 0;
  border: 0;
}
</style>
